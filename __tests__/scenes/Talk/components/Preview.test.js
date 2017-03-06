// @flow
import "react-native";
import React from "react";
import renderer from "react-test-renderer";

import Preview from "../../../../app/scenes/Talk/components/Preview";

describe("Talk - Preview", () => {
  it("renders correctly in top position", () => {
    const tree = renderer
      .create(
        <Preview
          position="top"
          speakerName="Max Stoiber"
          talkStartTime="9AM"
          title="React Boilerplate"
          subtitle="React Boilerplate"
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders correctly in bottom position", () => {
    const tree = renderer
      .create(
        <Preview
          position="bottom"
          speakerName="Max Stoiber"
          talkStartTime="9AM"
          title="React Boilerplate"
          subtitle="React Boilerplate"
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
