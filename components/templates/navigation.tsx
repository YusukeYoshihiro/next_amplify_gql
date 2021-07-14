import * as React from 'react';
import Link from 'next/link';

 const Navigation: React.FC = () =>{
  return (
    <div>
     <Link href="/">
       <a>Index</a>
     </Link>
     <Link href="/about">
       <a>About</a>
     </Link>
     <Link href="/todo">
       <a>Todo</a>
     </Link>
    </div>
  )
}

export default Navigation;

