import { PropsType } from '@/lib/utils';

const Divider = ({ children }: PropsType) => {
  return (
    <div role="hidden" className="mb-5 border-t">
      <span className="mx-auto -mt-4 block w-max rounded-md bg-linear-to-r from-sky-500 to-indigo-500 px-6 py-0.5 text-center text-gray-100">
        { children }
      </span>
    </div>
  );
};

export default Divider;
