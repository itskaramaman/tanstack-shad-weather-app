import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface AppAlertProps {
  title: string;
  description: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AppAlert = ({ title, description, onClick }: AppAlertProps) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        <Button onClick={onClick} variant="outline" className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default AppAlert;
