import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GenerateTimetableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateTimetableDialog({ open, onOpenChange }: GenerateTimetableDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [semester, setSemester] = useState("fall-2024");
  const [options, setOptions] = useState({
    avoidConflicts: true,
    optimizeRoomUsage: true,
    balanceLecturerLoad: true,
    preferMorningClasses: false,
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setIsComplete(false);

    // Simulate generation progress
    const steps = [
      { progress: 20, message: "Analyzing course requirements..." },
      { progress: 40, message: "Checking lecturer availability..." },
      { progress: 60, message: "Allocating rooms..." },
      { progress: 80, message: "Resolving conflicts..." },
      { progress: 100, message: "Finalizing timetable..." },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsGenerating(false);
    setIsComplete(true);
  };

  const handleClose = () => {
    if (isComplete) {
      toast({
        title: "Timetable Generated Successfully",
        description: "The new timetable has been saved and is ready for review.",
      });
    }
    setIsComplete(false);
    setProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl uppercase tracking-wide text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            GENERATE TIMETABLE
          </DialogTitle>
          <DialogDescription>
            Configure options and generate a new timetable for the selected semester.
          </DialogDescription>
        </DialogHeader>

        {!isGenerating && !isComplete ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall-2024">Fall 2024</SelectItem>
                  <SelectItem value="spring-2025">Spring 2025</SelectItem>
                  <SelectItem value="summer-2025">Summer 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Generation Options</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoidConflicts"
                    checked={options.avoidConflicts}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, avoidConflicts: checked as boolean })
                    }
                  />
                  <Label htmlFor="avoidConflicts" className="text-sm font-normal cursor-pointer">
                    Automatically avoid scheduling conflicts
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="optimizeRoomUsage"
                    checked={options.optimizeRoomUsage}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, optimizeRoomUsage: checked as boolean })
                    }
                  />
                  <Label htmlFor="optimizeRoomUsage" className="text-sm font-normal cursor-pointer">
                    Optimize room capacity usage
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="balanceLecturerLoad"
                    checked={options.balanceLecturerLoad}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, balanceLecturerLoad: checked as boolean })
                    }
                  />
                  <Label htmlFor="balanceLecturerLoad" className="text-sm font-normal cursor-pointer">
                    Balance lecturer workload
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preferMorningClasses"
                    checked={options.preferMorningClasses}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, preferMorningClasses: checked as boolean })
                    }
                  />
                  <Label htmlFor="preferMorningClasses" className="text-sm font-normal cursor-pointer">
                    Prefer morning class times
                  </Label>
                </div>
              </div>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Generating timetable...</p>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">{progress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Timetable Generated!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Successfully created timetable for {semester.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 w-full">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Classes Scheduled:</span>
                    <span className="font-semibold ml-2">28</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rooms Used:</span>
                    <span className="font-semibold ml-2">6</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lecturers Assigned:</span>
                    <span className="font-semibold ml-2">5</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conflicts:</span>
                    <span className="font-semibold ml-2 text-green-600">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isGenerating && !isComplete && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate}>
                Generate Timetable
              </Button>
            </>
          )}
          {isComplete && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => window.location.href = "/timetable"}>
                View Timetable
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
