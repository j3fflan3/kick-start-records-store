import * as React from "react";

interface OrderEmailTemplateProps {
  orderNumber: string;
  firstName: string;
  orderLink: string;
}

export default function OrderEmailTemplate({
  orderNumber,
  firstName,
  orderLink,
}: OrderEmailTemplateProps) {
  return (
    <div>
      <h1>Hi, {firstName}!</h1>
      <p>Thank you for your order!</p>
      <p>
        Follow this link to view your order:
        <a href={orderLink}>{orderNumber}</a>
      </p>
    </div>
  );
}
