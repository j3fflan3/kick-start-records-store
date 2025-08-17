import * as React from "react";

interface OrderEmailTemplateProps {
  orderNumber: string;
  fullName: string;
  orderLink: string;
}

export default function OrderEmailTemplate({
  orderNumber,
  fullName,
  orderLink,
}: OrderEmailTemplateProps) {
  return (
    <div className="ml-6">
      <h1>Hi, {fullName}!</h1>
      <h2>Thank you for your order!</h2>
      <h2>
        Follow this link to view your order details:&nbsp;
        <a href={orderLink}>{orderNumber}</a>
      </h2>
    </div>
  );
}
