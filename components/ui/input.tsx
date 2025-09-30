/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';

const Input = ({
  id,
  register,
  label,
  type,
  errors,
  disabled,
  validation,
  className = '',
}: any) => {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={type}
        id={id}
        autoComplete={id}
        disabled={disabled}
        {...register(id, { ...validation })}
        className={clsx(
          `
          text-md 
          peer 
          block 
          w-full 
          appearance-none 
          rounded-xl 
          bg-transparent  
          px-6 
          pb-1 
          pt-6 
          text-gray-900
          placeholder-gray-600
          shadow-sm  
          ring-1 
          ring-inset
          ring-gray-300 
          transition
          focus:ring-2
          focus:ring-inset
          focus:ring-sky-600
          `,
          errors[id] && 'ring-rose-500',
          disabled && 'cursor-default disabled:bg-gray-100',
        )}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="text-md text-zinc-150 peer-placeholder-shown:scale:100 absolute  left-6 top-4 z-10 origin-[0] -translate-y-3 scale-75 transform duration-150 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75"
      >
        {label}
      </label>
      {errors[id] && errors[id]?.type === 'required' && (
        <div className="mt-1 text-xs leading-3 text-rose-500">{label} is required</div>
      )}
      {errors[id] && errors[id]?.type === 'maxLength' && (
        <div className="mt-1 text-xs leading-3 text-rose-500">Max length exceeded</div>
      )}
      {errors[id] && errors[id]?.type === 'pattern' && (
        <div className="mt-1 text-xs leading-3 text-rose-500">
          {errors[id]?.message || 'Wrong Pattern'}
        </div>
      )}
      {errors[id] && errors[id]?.type === 'backend' && (
        <div className="mt-1 text-xs leading-3 text-rose-500">
          {errors[id]?.message || 'Server error'}
        </div>
      )}
    </div>
  );
};

export default Input;