
//并集（AuB）
export const union = (listA: [], listB: []) => {

}

//交集
const intersection = (listA: [], listB: []) => {

}

//交集的补集
const disjunction = (listA: [], listB: []) => {

}

//差集
export const subtract = (listA: any[], listB: any[]) => {
    let a = new Set(listA);
    let b = new Set(listB);
    return new Set([...a].filter(x => !b.has(x)));
}

// export { union, subtract }