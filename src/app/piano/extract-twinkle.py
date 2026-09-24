"""Split the supplied Twinkle collection at its printed movement headings.

Run: python src/app/piano/extract-twinkle.py [--check]
Generated scores retain original measure XML byte-for-byte; only inherited
initial state and a provenance comment are inserted before the first measure.
"""
import argparse
import copy
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'assets' / 'piano' / 'tracks'
SOURCE = ROOT / '12_Variations_of_Twinkle_Twinkle_Little_Star.mxl'
MEASURE = re.compile(r'<measure\b[^>]*>.*?</measure>', re.S)
ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']


def tag(node):
    return node.tag.rsplit('}', 1)[-1]


def children(node, name):
    return [child for child in node if tag(child) == name]


def initial_state(measures):
    inherited = {}
    clefs = {}
    tempo = None
    dynamics = None
    for measure in measures:
        for item in measure:
            if tag(item) == 'attributes':
                for field in item:
                    name = tag(field)
                    if name == 'clef':
                        clefs[field.get('number', '1')] = copy.deepcopy(field)
                    elif name in ('divisions', 'key', 'time', 'staves'):
                        inherited[name] = copy.deepcopy(field)
            for sound in item.iter():
                if tag(sound) != 'sound':
                    continue
                tempo = sound.get('tempo', tempo)
                dynamics = sound.get('dynamics', dynamics)
    if not all(key in inherited for key in ('divisions', 'key', 'time')) or not clefs:
        raise ValueError('Cannot reconstruct inherited score state.')
    attributes = ET.Element('attributes')
    for name in ('divisions', 'key', 'time', 'staves'):
        if name in inherited:
            attributes.append(inherited[name])
    for number in sorted(clefs, key=int):
        attributes.append(clefs[number])
    sound = ET.Element('sound', {key: value for key, value in [('tempo', tempo), ('dynamics', dynamics)] if value is not None})
    return ET.tostring(attributes, encoding='unicode'), ET.tostring(sound, encoding='unicode') if sound.attrib else ''


def validate_boundaries(measures, starts):
    ties, slurs, wedges, shifts, pedals, dashes = set(), set(), set(), set(), set(), set()
    for index, measure in enumerate(measures):
        for note in measure.iter('note'):
            pitch = note.find('pitch')
            if pitch is None:
                continue
            key = (note.findtext('staff', '1'), note.findtext('voice', '1'),
                   tuple((tag(field), field.text) for field in pitch))
            for tie in note.findall('tie'):
                if tie.get('type') == 'stop': ties.discard(key)
                elif tie.get('type') == 'start': ties.add(key)
            for slur in note.findall('./notations/slur'):
                marker = (note.findtext('staff', '1'), slur.get('number', '1'))
                if slur.get('type') == 'stop': slurs.discard(marker)
                elif slur.get('type') == 'start': slurs.add(marker)
        for direction in measure.findall('direction'):
            staff = direction.findtext('staff', '1')
            for wedge in direction.findall('./direction-type/wedge'):
                marker = (staff, wedge.get('number', '1'))
                if wedge.get('type') == 'stop': wedges.discard(marker)
                else: wedges.add(marker)
            for shift in direction.findall('./direction-type/octave-shift'):
                marker = (staff, shift.get('number', '1'))
                if shift.get('type') == 'stop': shifts.discard(marker)
                else: shifts.add(marker)
            for pedal in direction.findall('./direction-type/pedal'):
                if pedal.get('type') == 'stop': pedals.discard(staff)
                else: pedals.add(staff)
            for dash in direction.findall('./direction-type/dashes'):
                marker = (staff, dash.get('number', '1'))
                if dash.get('type') == 'stop': dashes.discard(marker)
                else: dashes.add(marker)
        if index + 1 in starts[1:-1] and any((ties, slurs, wedges, shifts, pedals, dashes)):
            raise ValueError('Notation crosses boundary after measure index %s: %s' %
                             (index + 1, (ties, slurs, wedges, shifts, pedals, dashes)))


def extract(check=False):
    with zipfile.ZipFile(SOURCE) as archive:
        xml = archive.read('score.xml').decode('utf-8')
    root = ET.fromstring(xml)
    parts = children(root, 'part')
    if len(parts) != 1:
        raise ValueError('Expected one part; multi-part extraction needs new logic.')
    measures = children(parts[0], 'measure')
    spans = list(MEASURE.finditer(xml))
    if len(measures) != len(spans):
        raise ValueError('Raw and parsed measure counts differ.')
    headings = []
    for index, measure in enumerate(measures):
        labels = [node.text.strip() for node in measure.iter('words') if node.text and node.text.strip()]
        if any(re.fullmatch(r'THEME\.', label) for label in labels):
            headings.append((index, 'Theme'))
        for roman in ROMAN:
            if 'VAR. %s.' % roman in labels:
                headings.append((index, 'Variation %s' % roman))
    expected = ['Theme'] + ['Variation %s' % roman for roman in ROMAN]
    if [name for _, name in headings] != expected or headings[0][0] != 0:
        raise ValueError('Unexpected movement headings: %s' % headings)
    starts = [index for index, _ in headings] + [len(measures)]
    validate_boundaries(measures, starts)
    prefix = xml[:spans[0].start()]
    suffix = xml[spans[-1].end():]
    for movement, ((begin, label), end) in enumerate(zip(headings, starts[1:])):
        if not measures[begin].findall('.//repeat[@direction="forward"]'):
            raise ValueError('%s lacks its opening repeat mark.' % label)
        if movement < 12 and not measures[end - 1].findall('.//repeat[@direction="backward"]'):
            raise ValueError('%s lacks its closing repeat mark.' % label)
        filename = 'Twinkle_Theme.musicxml' if movement == 0 else 'Twinkle_Variation_%02d.musicxml' % movement
        selected = [span.group() for span in spans[begin:end]]
        if movement:
            attributes, sound = initial_state(measures[:begin])
            opening = re.match(r'<measure\b[^>]*>', selected[0]).group()
            selected[0] = selected[0].replace(opening, opening + '\n      ' + attributes + ('\n      ' + sound if sound else ''), 1)
        provenance = '\n    <!-- Source: %s; original measure indices %d-%d and labels %s-%s. -->\n    ' % (
            SOURCE.name, begin + 1, end, measures[begin].get('number'), measures[end-1].get('number'))
        section_header = prefix.replace('>12 Variations</credit-words>',
                                        '>%s</credit-words>' % label)
        result = section_header + provenance + '\n    '.join(selected) + suffix
        parsed = ET.fromstring(result)
        extracted = children(children(parsed, 'part')[0], 'measure')
        if len(extracted) != end - begin or [m.get('number') for m in extracted] != [m.get('number') for m in measures[begin:end]]:
            raise ValueError('Measure provenance mismatch for %s' % label)
        output = ROOT / filename
        if check:
            if not output.exists() or output.read_text(encoding='utf-8') != result:
                raise ValueError('%s is missing or stale; rerun extraction.' % filename)
        elif not output.exists() or output.read_text(encoding='utf-8') != result:
            output.write_text(result, encoding='utf-8')
        print('%s: original measure indices %d-%d, labels %s-%s, %d measures' % (
            filename, begin+1, end, measures[begin].get('number'), measures[end-1].get('number'), end-begin))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    try:
        extract(args.check)
    except Exception as error:
        print(error, file=sys.stderr)
        sys.exit(1)
