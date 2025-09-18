import {Divider} from "@/components/catalyst/divider";
import {Heading, Subheading} from "@/components/catalyst/heading";
import {Select} from "@/components/catalyst/select";


export default function HomePage() {
  return (
    <>
      <Heading>Good afternoon, Talha</Heading>
      <Divider className="my-10" soft/>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        <div>
          <Select name="period">
            <option value="last_week">Last week</option>
            <option value="last_two">Last two weeks</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div>
      </div>
    </>
  );
}
