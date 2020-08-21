<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>pvr-node</Name>
    <UserStyle>
      <Title>PVR Style Per Scale</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Precise</Name>
          <MaxScaleDenominator>5000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#fff</CssParameter>
                </Fill>
              </Mark>
              <Size>8</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Usual</Name>
          <MinScaleDenominator>5000</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#fff</CssParameter>
                </Fill>
              </Mark>
              <Size>4</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Far</Name>
          <MinScaleDenominator>10000</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <Fill>
                  <CssParameter name="fill-opacity">0</CssParameter>
                </Fill>
              </Mark>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Global</Name>
          <MinScaleDenominator>5000000</MinScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <Fill>
                  <CssParameter name="fill-opacity">0</CssParameter>
                </Fill>
              </Mark>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
      <FeatureTypeStyle>
        <Rule>
          <Name>Precise</Name>
          <MaxScaleDenominator>5000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:Function name="env">
                      <ogc:Literal>color</ogc:Literal>
                      <ogc:Literal>#35A</ogc:Literal>
                    </ogc:Function>
                  </CssParameter>
                </Fill>
              </Mark>
              <Size>6</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Usual</Name>
          <MinScaleDenominator>5000</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                    <ogc:Function name="env">
                      <ogc:Literal>color</ogc:Literal>
                      <ogc:Literal>#35A</ogc:Literal>
                    </ogc:Function>
                  </CssParameter>
                </Fill>
              </Mark>
              <Size>2</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Far</Name>
          <MinScaleDenominator>10000</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <Fill>
                  <CssParameter name="fill-opacity">0</CssParameter>
                </Fill>
              </Mark>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Global</Name>
          <MinScaleDenominator>5000000</MinScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <Fill>
                  <CssParameter name="fill-opacity">0</CssParameter>
                </Fill>
              </Mark>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
