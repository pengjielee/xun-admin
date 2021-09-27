import React from "react";

interface IProps {
  name: string;
  age: number;
}

const Intro: React.FC<IProps> = (props) => {
  const { name, age } = props;
  return (
    <div>
      My name is {name}. I am {age} years old.
    </div>
  );
};

export default Intro;
