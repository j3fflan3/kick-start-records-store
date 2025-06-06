import React from "react";

type TestPageParams = {
  hello: string;
};
const Page: React.FC<TestPageParams> = () => {
  return (
    <div>
      <h3>Test</h3>
    </div>
  );
};

export default Page;
