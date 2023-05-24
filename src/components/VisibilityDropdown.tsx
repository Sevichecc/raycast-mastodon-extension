import { getPreferenceValues, Color, Form } from "@raycast/api";
import { VisibilityScope } from "../utils/types";
import { getIconForVisibility, getNameForVisibility } from "../utils/helpers";

const visibilityOptions: VisibilityScope[] = ["public", "unlisted", "private", "direct"];

const VisibilityDropdown = () => {
  const { defaultVisibility }: Preferences = getPreferenceValues();

  return (
    <Form.Dropdown id="visibility" title="Visibility" storeValue={true} defaultValue={defaultVisibility || undefined}>
      {visibilityOptions.map((option) => (
        <Form.Dropdown.Item
          key={option}
          value={option}
          title={getNameForVisibility(option)}
          icon={{ source: getIconForVisibility(option), tintColor: Color.SecondaryText }}
        />
      ))}
    </Form.Dropdown>
  );
};

export default VisibilityDropdown;
