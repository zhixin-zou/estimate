export const estimateStatus = [
    { value: '0', text: '待预估' },
    { value: '1', text: '预估中' },
    { value: '2', text: '已预估待入账' },
    { value: '3', text: '已入账' },
]

export const dateOptions = [
    { value: '0', text: '待预估' },
    { value: '1', text: '预估中' },
    { value: '2', text: '已预估待入账' },
    { value: '3', text: '已入账' },
]


const set = {
    estimateStatus
}

export const getText = (dictName, value) => {
    const dict = set[dictName]
    if (!dict) {
        return value
    }

    const item = dict.find(x => x.value === value)
    if (item) {
        return item.text
    } else {
        return value
    }
}

export default {
    ...set,
    getText
}