

const mockFunction = {
    name: '123',
    mark: '345',
    input: [
        {
            id: '1',
            name: 'In1',
            mark: 'm1',
            type: 'int',
            valueType: {
                min: '12',
                max: '20',
                unit: 'percent',
            }
        }, {
            id: '2',
            name: 'In2',
            mark: 'm2',
            type: 'int',
            valueType: {
                min: '12',
                max: '20',
                unit: 'percent',
            }
        }, {
            id: '3',
            name: 'In3',
            mark: 'm3',
            type: 'int',
            valueType: {
                min: '12',
                max: '20',
                unit: 'percent',
            }
        }],
    output: [
        {
            id: '1',
            name: 'Out1',
            mark: 'o1',
            type: 'int',
            valueType: {
                min: '12',
                max: '20',
                unit: 'percent',
            }
        }
        ,
        {
            id: '2',
            name: 'Out2',
            mark: 'o2',
            type: 'int',
            valueType: {
                min: '12',
                max: '20',
                unit: 'percent',
            }
        },
        {
            id: '3',
            name: 'Out3',
            mark: 'o3',
            type: 'int',
            valueType: {
                min: '12',
                max: '20',
                unit: 'percent',
            }
        }],
    async: true,
    describe: '简单描述',
};

export default mockFunction;