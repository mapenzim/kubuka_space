import { getUserAllExperience, getUserBio, getUserExperience, getUserSkills } from "@/app/actions/authActions.server";
import { getAllOrdersByUser } from "@/app/actions/cartActions.server";
import { getOwnPosts } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { DeleteUserExperience } from "@/components/buttons/delete-experience-btn";
import { CartLink } from "@/components/cart/components/cart_status";
import { AddUpdateBioPopover } from "@/components/poper/add-update-bio";
import { AddUpdateExperiencePopover } from "@/components/poper/add-update-experience";
import { AddUpdateSkillPopover } from "@/components/poper/add-update-skills";
import { Badge, Box, Button, Card, Flex, Grid, Heading, ScrollArea, Text, Avatar, Separator } from "@radix-ui/themes";
import { FacebookIcon, GithubIcon, Tag, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation"; 
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/authentication");

  const user = session?.user; 
  
  const bio = await getUserBio(String(user?.id));
  const workExperience = await getUserAllExperience(user?.id as string);
  const userSkill = await getUserSkills(user?.id as string);
  const posts = await getOwnPosts(user?.id as string);
  const orders = await getAllOrdersByUser(user?.id as string);
  
  return (
    <Box className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Box className="max-w-7xl mx-auto">
        <Grid columns={{ initial: "1", md: "12" }} gap="6" align="start" py="64px">

          {/* =========================================
              LEFT COLUMN: Profile & Skills (Spans 4)
              ========================================= */}
          <Flex direction="column" gap="6" className="md:col-span-4 md:sticky ">
            
            {/* Profile Card */}
            <Card size="1" variant="ghost" className="dark:bg-zinc-800! border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl text-center">
              <Flex direction="column" align="center" gap="4">
                <Avatar
                  size="8"
                  src={user?.image ?? "/images/mape.png"}
                  fallback={user?.name?.charAt(0) || "U"}
                  color="iris"
                  radius="full"
                  className="shadow-sm border-4 border-zinc-50 dark:border-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800"
                />
                
                <Box>
                  <Heading as="h1" size="6" weight="bold" className="text-zinc-900 dark:text-zinc-300">
                    {user?.name}
                  </Heading>
                  <Text as="p" size="2" color="gray" mt="1" className="dark:text-zinc-500!">
                    {user?.email}
                  </Text>
                </Box>

                <Button size="2" variant="soft" color="iris" className="w-full mt-2 dark:text-indigo-400!" asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </Flex>
            </Card>

            {/* Skills Card */}
            <Card size="1" variant="ghost" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
              <Flex align="center" justify="between" mb="4">
                <Heading as="h3" size="4" className="text-zinc-900 dark:text-zinc-100">
                  Skills
                </Heading>
                <AddUpdateSkillPopover skill={null} />
              </Flex>
              
              <ScrollArea type="auto" scrollbars="vertical" className="max-h-64 pr-3">
                <Flex direction="column" gap="2">
                  {userSkill?.length > 0 ? (
                    userSkill.map((skill: { id: Key | null | undefined; text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                      <Flex key={skill.id} align="center" gap="2" className="bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-lg">
                        <Tag className="w-4 h-4 text-(--iris-11)" />
                        <Text size="2" weight="medium" className="text-zinc-700 dark:text-zinc-300">
                          {skill?.text}
                        </Text>
                      </Flex>
                    ))
                  ) : (
                    <Text size="2" color="gray" className="italic text-center py-4 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
                      No skills added yet.
                    </Text>
                  )}
                </Flex>
              </ScrollArea>
            </Card>

          </Flex>


          {/* =========================================
              RIGHT COLUMN: Main Content (Spans 8)
              ========================================= */}
          <Flex direction="column" gap="6" className="md:col-span-8">
            
            <Card size="1" variant="ghost" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
              <Flex direction="column" gap="8">

                {/* --- About Me Section --- */}
                <Box>
                  <Flex align="center" justify="between" mb="3">
                    <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300">About Me</Heading>
                    <AddUpdateBioPopover bio={bio} />
                  </Flex>
                  <Text as="div" size="3" className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {bio?.text ? (
                      <span className="whitespace-pre-wrap">{bio.text}</span>
                    ) : (
                      <Text size="2" color="gray" className="italic block p-4 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-center dark:text-zinc-500!">
                        Add something about yourself...
                      </Text>
                    )}
                  </Text>
                </Box>

                <Separator size="4" className="bg-zinc-200 dark:bg-zinc-600!" />

                {/* --- Social Media Section --- */}
                <Box className="text-center">
                  <Heading as="h4" size="3" weight="medium" color="gray" mb="4" className="uppercase tracking-wider dark:text-zinc-400!">
                    Connect With Me
                  </Heading>
                  <Flex justify="center" gap="4">
                    <Button variant="soft" color="gray" radius="full" className="w-10 h-10 p-0 cursor-pointer text-indigo-500! hover:text-blue-600! transition-colors">
                      <FacebookIcon size={20} />
                    </Button>
                    <Button variant="soft" color="gray" radius="full" className="w-10 h-10 p-0 cursor-pointer text-indigo-400! hover:text-sky-500! transition-colors">
                      <TwitterIcon size={20} />
                    </Button>
                    <Button variant="soft" color="gray" radius="full" className="w-10 h-10 p-0 cursor-pointer hover:text-zinc-900! dark:hover:text-white! text-gray-200! transition-colors">
                      <GithubIcon size={20} />
                    </Button>
                  </Flex>
                </Box>

                <Separator size="4" className="bg-zinc-200 dark:bg-zinc-800!" />

                {/* --- Work Experience Section --- */}
                <Box>
                  <Flex align="center" justify="between" mb="5">
                    <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300">Work Experience</Heading>
                    <AddUpdateExperiencePopover />
                  </Flex>
                  
                  <Flex direction="column" gap="4">
                    {workExperience.length ? (
                      workExperience.map((exp: { id: string; jobTitle: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; companyName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; dates: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; duties: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                        <Box key={exp.id} className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 pb-2 last:pb-0">
                          {/* Timeline dot */}
                          <div className="absolute w-3 h-3 bg-(--iris-9) rounded-full -left-1.75 top-1.5 ring-4 ring-white dark:ring-zinc-900" />
                          
                          <Flex justify="between" align="start" wrap="wrap" gap="4" mb="2">
                            <Box>
                              <Heading as="h4" size="4" className="text-zinc-900 dark:text-zinc-100">
                                {exp.jobTitle}
                              </Heading>
                              <Text size="2" color="gray" weight="medium" className="mt-1 flex items-center gap-2">
                                {exp.companyName} <span>•</span> {exp.dates}
                              </Text>
                            </Box>
                            
                            <Flex gap="2">
                              <DeleteUserExperience id={exp.id} />
                            </Flex>
                          </Flex>
                          
                          <Text as="p" size="2" className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap mt-2">
                            {exp.duties}
                          </Text>
                        </Box>
                      ))
                    ) : (
                      <Text size="2" color="gray" className="italic p-6 border border-dashed border-zinc-200 dark:border-zinc-700 dark:text-zinc-600! rounded-lg text-center">
                        No work experience added yet.
                      </Text>
                    )}
                  </Flex>
                </Box>

                <Separator size="4" className="bg-zinc-200 dark:bg-zinc-800!" />

                {/* --- Publications Section --- */}
                <Box>
                  <Flex align="center" justify="between" mb="4">
                    <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300">Publications</Heading>
                    <Button size="1" variant="ghost" asChild>
                      <Link href="/posts" className="dark:text-indigo-400!">Visit blog area &rarr;</Link>
                    </Button>
                  </Flex>

                  <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                    {posts.length ? (
                      posts.map((post: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; published: any; }) => (
                        <Card key={post.id} variant="ghost" size="2" className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800" m="4">
                          <Flex direction="column" justify="between" className="h-full">
                            <Heading as="h4" size="3" className="line-clamp-2 text-zinc-800 dark:text-zinc-400 mb-3">
                              {post.title}
                            </Heading>
                            <Box>
                              <Badge color={post.published ? "green" : "orange"} variant="soft">
                                {post.published ? "Published" : "Draft"}
                              </Badge>
                            </Box>
                          </Flex>
                        </Card>
                      ))
                    ) : (
                      <Text size="2" color="gray" className="col-span-full italic p-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-center dark:text-zinc-600!">
                        No publications found.
                      </Text>
                    )}
                  </Grid>
                </Box>

                <Separator size="4" className="bg-zinc-200 dark:bg-zinc-800!" />

                {/* --- Orders Section --- */}
                <Box>
                  <Flex align="center" justify="between" mb="4">
                    <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300">Shopping & Orders</Heading>
                    <Button size="1" variant="ghost" asChild>
                    <CartLink />
                    </Button>
                  </Flex>

                  <Flex direction="column" gap="4">
                    {orders.length ? (
                      orders.map((order: { id: Key | null | undefined; totalAmount: any; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; items: any[]; }) => (
                        <Card key={order.id} variant="ghost" size="2" className="bg-zinc-500 dark:bg-zinc-900! border border-zinc-200 dark:border-zinc-800" m={{ sm: "1", md: "4" }}>
                          <Flex justify="between" align="center" wrap="wrap" gap="4" mb="3">
                            <Text size="2" weight="bold" className="text-zinc-700 dark:text-zinc-600">
                              Order #: {String(order.id).slice(-6).toUpperCase()}
                            </Text>
                            <Flex gap="2" align="center">
                              <Badge color="blue" variant="soft">${Number(order.totalAmount).toFixed(2)}</Badge>
                              <Badge color={order.status === "paid" ? "green" : "gray"} variant="surface">
                                {order.status}
                              </Badge>
                            </Flex>
                          </Flex>
                          
                          <Flex direction="column" gap="1" className="text-sm text-zinc-600 dark:text-zinc-500">
                            {order.items.map((itm: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: any; }) => (
                              <Flex key={itm.id} justify="between" className="border-t border-zinc-200 dark:border-zinc-800/50 pt-1 mt-1">
                                <Text size="1" className="line-clamp-1">{itm.title}</Text>
                                <Text size="1" weight="medium">${Number(itm.price).toFixed(2)}</Text>
                              </Flex>
                            ))}
                          </Flex>
                        </Card>
                      ))
                    ) : (
                      <Text size="2" color="gray" className="col-span-full italic p-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-center dark:text-zinc-600!">
                        Your order history is empty.
                      </Text>
                    )}
                  </Flex>
                </Box>

              </Flex>
            </Card>

          </Flex>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProfilePage;