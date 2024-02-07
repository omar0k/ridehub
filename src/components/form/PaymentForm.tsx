import { trpc } from "@/app/_trpc/client";
import { FormInfoData } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";

interface PaymentFormProps {
  form: UseFormReturn<FormInfoData>;
}
const PaymentForm: React.FC<PaymentFormProps> = ({ form }) => {
  

  return (
    <div>
      {/* <Button onClick={() => createStripeSession()}>Check out</Button> */}
    
    </div>
  );
};
export default PaymentForm;
