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
    },
    // district with missing data
    1906: {
        P: 923
    },
    // district with error in reporting
    1907: {
        C: 1,
        S: -1,
        P: 0,
        aC: 2,
        aP: 193
    },
};

const mockFeature = (district_number) => {
    return {
        properties: {
            district_number: district_number,
            district_name: "Test District Name",
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

test('style of district that does not exist returns stripes', () => {
    M.processedData = mockData;
    style = M.getOptions().style(mockFeature(101));
    expect(style.fillColor).toEqual('#707070');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBe(M.stripes);
});

test('style of district that is missing data returns stripes', () => {
    M.processedData = mockData;
    style = M.getOptions().style(mockFeature(1906));
    expect(style.fillColor).toEqual('#707070');
    expect(style.weight).toBe(1);
    expect(style.opacity).toBe(1);
    expect(style.color).toBe('#b3b3b3');
    expect(style.fillOpacity).toBe(0.6);
    expect(style.fillPattern).toBe(M.stripes);
});

test('popup of district with higher count than population shows error', () => {
    M.processedData = mockData;
    var layer = { bindPopup : jest.fn() };
    M.getOptions().onEachFeature(mockFeature(1907), layer);
    expect(layer.bindPopup).toBeCalledWith("<span class='popup-text'>The statistics for <b>Test District Name</b> appear " +
        "to have an <b>error</b>. They report that there were 0 <b>Black/African American " +
        "Students</b> and that they received 1 <b>Out of School Suspensions</b>, out of a district total " +
        "of fewer than 10.</span>");
});
