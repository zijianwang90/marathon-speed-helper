
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => (
  <TooltipPrimitive.Trigger ref={ref} {...props} />
))
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// 创建一个新的组件，它会处理移动端和桌面端的不同行为
const ResponsiveTooltip = ({ 
  children, 
  content,
  ...props 
}: { 
  children: React.ReactNode;
  content: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, "content">) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Tooltip 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      delayDuration={0}
    >
      <TooltipTrigger asChild onClick={() => setIsOpen(prev => !prev)}>
        {children}
      </TooltipTrigger>
      <TooltipContent {...props}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, ResponsiveTooltip }
