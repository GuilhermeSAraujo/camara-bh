import * as React from 'react';

import { cn } from '../../lib/utils';

const Textarea = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:border-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
