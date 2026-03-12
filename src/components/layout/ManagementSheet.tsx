import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ManagementConsole } from "@/components/dashboard/ManagementConsole";
import { useAuth } from "@/contexts/AuthContext";

export function ManagementSheet() {
  const { user } = useAuth();
  
  if (user?.role !== "admin") return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest rounded-xl h-10 px-4 gap-2 flex"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Management Console</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 border-l border-border/40 bg-background/95 backdrop-blur-md overflow-y-auto">
        <SheetHeader className="p-8 border-b border-border/10 bg-muted/30">
          <SheetTitle className="text-2xl font-black uppercase tracking-tight text-primary">Global Management Console</SheetTitle>
          <SheetDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
            Add teachers, subjects, pupils, rooms, and time slots from any page.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 sm:p-8">
          <ManagementConsole />
        </div>
      </SheetContent>
    </Sheet>
  );
}
