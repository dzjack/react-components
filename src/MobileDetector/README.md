# MobileDetector

Top-level component which detects device type and passes this info to children as context

## Props
|Name|Type|Default|Description|
|----|----|-------|-----------|
| **children** | <code>Function</code> |  | **required**. Children must be passed as function so to propagte context correctly. Environment info is also passed as first argument to the callback |
| **forceDesktop** | <code>Boolean</code> |  | *optional*. Ignores real device type and considers it as desktop |
| **userAgent** | <code>String</code> |  | *optional*. Custom user-agent |