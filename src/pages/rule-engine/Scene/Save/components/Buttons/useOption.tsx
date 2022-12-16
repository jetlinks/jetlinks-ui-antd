import { useMemo } from 'react';

interface OptionsProps {
  paramOptions: any[];
  valueOptions: Map<string, any>;
}

const useOptions = (options: any[], key?: any): OptionsProps => {
  return useMemo(() => {
    const _options = options || [];
    const valueOptions = new Map<string, any>();

    function dig(optionsList: any[]) {
      optionsList.forEach((option) => {
        const _key = key || 'key';
        valueOptions.set(option[_key], option);
        if (option.children) {
          dig(option.children);
        }
      });
    }

    dig(_options);

    return {
      paramOptions: _options,
      valueOptions: valueOptions,
    };
  }, [options, key]);
};

export default useOptions;
