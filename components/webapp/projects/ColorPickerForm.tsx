import { cn } from "@/lib/utils"; // For utility classes
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller } from "react-hook-form";

const colors = ["blue", "indigo", "purple", "normal"];

export function ColorPicker({ control }: { control: any }) {
  return (
    <Controller
      name="color"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Color</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "h-10 w-10 rounded-lg border-2 transition-all",
                    field.value === color
                      ? "border-primary ring-2 ring-primary"
                      : `  `,
                    {
                      "bg-blue-500": color === "blue",
                      "bg-indigo-500": color === "indigo",
                      "bg-purple-500": color === "purple",
                      "bg-gray-400": color === "normal",
                    },
                  )}
                  onClick={() => field.onChange(color)}
                />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
