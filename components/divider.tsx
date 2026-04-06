import { PropsType } from '@/lib/utils';

const Divider = ({ children }: PropsType) => {
  return (
    <div role="hidden" className="mb-8">
      <span className="flex items-center">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

        <span className="shrink-0 px-4 text-gray-900 dark:text-white">{ children }</span>

        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
      </span>
    </div>
  );
};

export default Divider;
