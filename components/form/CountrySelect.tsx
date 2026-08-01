import { forwardRef } from "react";
import { countries } from "@/lib/data/countries";
import { inputClassName } from "@/components/form/inputStyles";
import { cn } from "@/lib/utils/cn";

export type CountrySelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  function CountrySelect({ className, ...props }, ref) {
    return (
      <select ref={ref} className={cn(inputClassName, "appearance-none", className)} {...props}>
        {countries.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
    );
  },
);
