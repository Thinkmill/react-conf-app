// @flow
import "react-native";
import React from "react";
import renderer from "react-test-renderer";

import SplashScreen
  from "../../../../app/scenes/Schedule/components/SplashScreen";

describe("Schedule - Splash Screen", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SplashScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders correctly in animated state", () => {
    const tree = renderer.create(<SplashScreen animated />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
