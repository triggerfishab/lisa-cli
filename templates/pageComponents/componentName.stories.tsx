import type { ComponentMeta, ComponentStory } from "@storybook/react"

import COMPONENTNAME from "../../components/pageComponents/COMPONENTNAME/COMPONENTNAME"
export default {
  title: "PageComponents/COMPONENTNAME",
  component: COMPONENTNAME,
  parameters: {
    docs: {
      description: {
        component: "COMPONENTNAME"
      }
    }
  }
} as ComponentMeta<typeof COMPONENTNAME>

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof COMPONENTNAME> = (args) => (
  <COMPONENTNAME {...args} />
)

export const Default = Template.bind({})

Default.args = {
  fieldGroupName: "Page_Pagecomponentsgroup_PageComponents_COMPONENTNAME"
}
