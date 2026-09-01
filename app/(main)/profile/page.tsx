import { getUserAllExperience, getUserBio, getUserSkills } from "@/app/actions/authActions.server";
import { getAllOrdersByUser } from "@/app/actions/cartActions.server";
import { getOwnPosts } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { CartLink } from "@/components/cart/components/cart_status";
import BioSection from "@/components/profile/bio_section";
import SkillsCard from "@/components/profile/skills_card";
import WorkExperienceSection from "@/components/profile/work_experience_section";
import { Badge, Box, Button, Card, Flex, Grid, Heading, Text, Avatar, Separator } from "@radix-ui/themes";
import { FacebookIcon, GithubIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation"; 

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/authentication");

  const user = session.user;
  const userId = user.id;

  if (!userId) return redirect("/authentication");

  const [bio, workExperience, userSkill, posts, orders] = await Promise.all([
    getUserBio(userId),
    getUserAllExperience(userId),
    getUserSkills(userId),
    getOwnPosts(userId),
    getAllOrdersByUser(userId),
  ]);
  
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
                  src={user?.image ?? "/images/kubuka-logo.png"}
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

            <SkillsCard initialSkills={userSkill} />

          </Flex>


          {/* =========================================
              RIGHT COLUMN: Main Content (Spans 8)
              ========================================= */}
          <Flex direction="column" gap="6" className="md:col-span-8">
            
            <Card size="1" variant="ghost" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
              <Flex direction="column" gap="8">

                <BioSection initialBio={bio} />

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

                <WorkExperienceSection initialExperiences={workExperience} />

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
                      posts.map((post) => (
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
                      orders.map((order) => (
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
                            {order.items.map((itm) => (
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
