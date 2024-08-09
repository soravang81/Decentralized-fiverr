import { cn } from "@/lib/utils";

type ContainerProps = {
    children?: React.ReactNode,
    className? :  string
};

export const Container = ({ children , className}: ContainerProps) => {
    
    return (
        <div className={cn("md:m-8 sm:m-6 m-3" , className)}>
            {children}
        </div>
    );
};
