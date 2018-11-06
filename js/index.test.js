const mockData = {
    1902: {
        C: 7,
        P: 43,
        S: 5,
        aC: 46,
        aP: 622
    },
    1904: {
        C: 1,
        P: 100,
        S: 10,
        aC: 46,
        aP: 622
    },
    1905: {
        C: 7,
        P: 43,
        S: 0,
        aC: 46,
        aP: 622
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
    document.body.innerHTML ='<div class="viewport" id="leMap"><div id="map" class="map"></div><div class="year_selector" id="searchbox"></div>';
    var Map = require('./index.js');
    M = new Map("leMap");
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
    style = M.getOptions().style(mockFeature(1905));
    expect(style.fillColor).toEqual('#2d004b');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBeFalsy();
});

test('style of value 10 returns dark red style', () => {
    M.processedData = mockData;
    style = M.getOptions().style(mockFeature(1904));
    expect(style.fillColor).toEqual('#aa0208');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBeFalsy();
});
