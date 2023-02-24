import { Component } from "@/components/styled/content"
import type { TCOMPONENTNAME } from "./types"

export default function COMPONENTNAME(props: TCOMPONENTNAME) {
  return (
    <Component>
      Component: COMPONENTNAME
      <br />
      Props: {JSON.stringify(props)}
    </Component>
  )
}
