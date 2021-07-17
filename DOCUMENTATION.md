# Documentation

Work Flow Chart comprises its flows with steps, each box that is generated in the final image is considered a step.

### Keywords
---
###### flowType
Specifies the type of step each flow **must** begin with a `flowType` of `start`. Flows can extend from the `start` of the flow with flowType of `step`, `throws`, or `ends`.

Possible Values:
- start
- throws
- step
- end

Usage:
```java
/*
* @flowType start
*/
```

###### flowId
`flowId` is the ID of the step. Each step within the flow must have a unique id.

Possible Values:
- any string

Usage:
```java
/*
* @flowId id
*/
```

###### flowPrevious
`flowPrevious` is the ID of the previous step. The current step will extend from the previous step by its ID.

Possible Values:
- any string

Usage:
```java
/*
* @flowPrevious id
*/
```

###### flowTitle
`flowTitle` is the name of the step. When the output is generated each step will show its respective `flowTitle`. In the [example output](https://github.com/Megapixel99/workflow-chart/blob/master/example/exampleFlow.png), the flow title in the top (green) box is `Beginning`.

Possible Values:
- any string

Usage:
```java
/*
* @flowTitle begining
*/
```

###### flowCondition
`flowCondition` is used if the current step extends from the previous only on a certain condition such as the number of objects in a response being equal to five.

Possible Values:
- any string

Usage:
```java
/*
* @flowCondition 5
*/
```

###### flowLegend
`flowLegend` can be used to clarify any acronyms which are used in the flow. In the [example output](https://github.com/Megapixel99/workflow-chart/blob/master/example/exampleFlow.png), the acronym is shown in the box in the upper-right corner of the image.

Possible Values:
- any two strings

Usage:
```java
/*
* @flowLegend theAcronym What the Acronym stands for
*/
```
