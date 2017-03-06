// @flow
import "react-native";
import React from "react";
import renderer from "react-test-renderer";

import Hint from "../../../../app/scenes/Talk/components/Hint";

describe("Talk - Hint", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Hint onClose={() => {}} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
