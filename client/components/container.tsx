import { cn } from "@/lib/utils";

type ContainerProps = {
    children?: React.ReactNode,
    className? :  string
};

export const Container = ({ children , className}: ContainerProps) => {
    
    return (
        <div className={cn("lg:px-56 md:px-28 sm:px-18 p-10" , className)}>
            {children}
        </div>
    );
};
