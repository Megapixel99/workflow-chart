/*
* @flowLegend api application programming interface
*/
/*
* @flowType start
* @flowTitle Beginning
*/
/*
* @flowType step
* @flowId step1
* @flowPrevious start
* @flowTitle call api
*/
/*
* @flowType step
* @flowId step2
* @flowPrevious step1
* @flowTitle get users
*/
/*
* @flowType condition
* @flowId cond1
* @flowPrevious step2
* @flowTitle numUsers
*/
/*
* @flowType throws
* @flowId throws1
* @flowPrevious cond1
* @flowTitle error
* @flowCondition 5
*/
/*
* @flowType step
* @flowId step3
* @flowPrevious cond1
* @flowTitle call api
* @flowCondition 10
*/
