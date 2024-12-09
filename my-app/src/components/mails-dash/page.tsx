// "use client"
// import { cookies } from "next/headers"
import Image from "next/image"
import { Mail } from "./components/mail";


interface APIDATATYPE {
  emails: EMAILFROMAPI[]; // Updated to match API response key
  success: boolean;
}

interface EMAILFROMAPI {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  when: string;
  _id: string;
}

interface sortedemailtype{
  from: any; 
  emails: EMAILFROMAPI[]
}

export default function MailPage({sortedemail}:{sortedemail: sortedemailtype[]}) {
  // const cookiesData = await cookies();
  // const layout = cookiesData.get("react-resizable-panels:layout:mail");
  // const collapsed = cookiesData.get("react-resizable-panels:collapsed");

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  const defaultLayout = undefined
  const defaultCollapsed = undefined

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          // accounts={accounts}
          mails={sortedemail[0].emails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  )
}