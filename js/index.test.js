const mockData = {
    2015: {
        ALL: {
            POP: {
                1902: { C: 640 },
                1904: { C: 1000 }
            },
            OSS: {
                1902: { C: 16, S: 0},
                1904: { C: 20, S: 0}
            },
            EXP: {
                1902: { C: 0, S: 5},
                1904: { C: 1, S: 6}
            }
        },
        BLA: {
            POP: {
                1902: { C: 30 },
                1904: { C: 100 }
            },
            OSS: {
                1902: { C: 1, S: 5},
                1904: { C: 20, S: 10}
            },
            EXP: {
                1902: { C: 0, S: 5},
                1904: { C: 0, S: 5}
            }
        },
        WHI: {
            POP: {
                1902: { C: 500 },
                1904: { C: 800 }
            },
            OSS: {
                1902: { C: 1, S: 0},
                1904: { C: 1, S: 0}
            },
            EXP: {
                1902: { C: 0, S: 5},
                1904: { C: 0, S: 5}
            }
        }
    }
};

const mockFeature = (district_number) => {
    return {
        properties: {
            district_number: district_number
        }
    };
};

beforeEach(() => {
    L = require('leaflet-headless');
    Pattern = require('./leaflet.pattern.js');
    $ = require('jquery');
    document.body.innerHTML = '<div class="viewport" id="leMap"><div id="map" class="map"></div>'
    M = require('./index.js');
});

test('style of value 5 returns white style', () => {
    M.processedData = mockData;
    style = M.getOptions().style(mockFeature(1902));
    expect(style.fillColor).toEqual('white');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBeFalsy();
});

test('style of value 0 returns dark purple style', () => {
    M.processedData = mockData;
    M.population = 6; // white
    style = M.getOptions().style(mockFeature(1902));
    expect(style.fillColor).toEqual('#54278f');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBeFalsy();
});

test('style of value 10 returns dark red style', () => {
    M.processedData = mockData;
    M.population = 0; // black
    style = M.getOptions().style(mockFeature(1904));
    expect(style.fillColor).toEqual('#a50f15');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBeFalsy();
});

