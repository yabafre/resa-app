import React,{ useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { Trash2 } from 'lucide-react';



export const metadata = {
  title: 'Home',
  description: 'Welcome to the home page',
}

export default function Home({ servicesByCategory }) {
    const { cart, addToCart, removeFromCart } = useCart()
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedService, setSelectedService] = useState(null)
    const [categoryCounts, setCategoryCounts] = useState({});
    const [categories, setCategories] = useState([])
    const [services, setServices] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantity, setTotalQuantity] = useState(0)

    function handleSelectCategory(category) {
        setSelectedCategory(category)
        const services = servicesByCategory.find((c) => c.name === category.name).services
        setServices(services)
        // console.log('services:', services)
    }

    function handleAddToCart() {
        addToCart({ ...selectedService })
        setOpenDrawer(false)
        setSelectedService(null)
    }

    function handleRemoveFromCart() {
        removeFromCart(selectedService.id)
        setOpenDrawer(false)
        setSelectedService(null)
    }

    function handleSelectService(service) {
        console.log('service:', service)
        setSelectedService(service)
        setOpenDrawer(true)
    }

    function handleCloseDrawer() {
        setOpenDrawer(false)
        setSelectedService(null)
    }

    useEffect(() => {
        // Filtrer les objets vides du panier avant le calcul
        const validItems = cart.filter(item => Object.keys(item).length !== 0);

        // Calculer le prix total en utilisant les items valides
        const totalPrice = validItems.reduce((acc, item) => acc + (item.price ?? 0), 0);
        setTotalPrice(totalPrice);

        // La quantité totale est simplement le nombre d'items valides dans le panier
        const totalQuantity = validItems.length;
        setTotalQuantity(totalQuantity);

        const counts = {};

        validItems.forEach(item => {
            // Supposons que chaque item du panier a un champ `categoryId`
            counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
        });

        setCategoryCounts(counts)
    }, [cart])

    useEffect(() => {
        const categories = servicesByCategory.map((category) => category)
        setCategories(categories)
    }, [servicesByCategory])

    useEffect(() => {
        // console.log('servicesByCategory:', servicesByCategory)
    }, [servicesByCategory])

    return (
        <div>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Head>
            <div className={'contain-services flex flex-row gap-6'}>
                <div className={'menu-categories w-1/3 flex flex-col gap-4'}>
                    <Card>
                        <CardContent>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <Table>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <Button
                                                    className={'w-full flex flex-row justify-between items-center gap-4'}
                                                    key={category}
                                                    onClick={() => handleSelectCategory(category)}
                                                    variant={category.id === selectedCategory.id ? '' : 'secondary'}
                                                >
                                                    <span>{category.name}</span>
                                                    {categoryCounts[category.id] > 0 && (
                                                        <Badge
                                                            variant={category.id === selectedCategory.id ? 'secondary' : 'outline'}
                                                            className={category.id === selectedCategory.id ? 'text-black dark:text-white' : 'bg-primary text-white'}
                                                        >{categoryCounts[category.id]}</Badge>
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <ScrollArea className={'list-services w-2/3 h-[80vh]'}>
                    <div className={'w-full px-4'}>
                        <Card>
                            <CardContent>
                                <CardHeader>
                                    <CardTitle>Services</CardTitle>
                                </CardHeader>
                                <Table>
                                    <TableCaption>List des services</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {services.map((service) => (
                                            <TableRow key={service.id}>
                                                <TableCell colSpan={3}>
                                                    <HoverCard>
                                                        <HoverCardTrigger>
                                                            <Table>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            className="text-left flex flex-col gap-4">
                                                                            <span>
                                                                                {service.name}
                                                                            </span>
                                                                            <span className={'text-lg text-gray-500'}>
                                                                                {service.duration} min
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            className="text-right">{service.price}€</TableCell>
                                                                        <TableCell className="text-right w-12">
                                                                            <Button
                                                                                onClick={() => handleSelectService(service)}
                                                                                variant={cart.find((item) => item.id === service.id) ? '' : 'secondary'}
                                                                            >Select</Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className={'relative'}>
                                                            <Card className={'w-fit'}>
                                                                <CardContent className={"w-full"}>
                                                                    <CardHeader>
                                                                        <CardTitle>{service.name}</CardTitle>
                                                                    </CardHeader>
                                                                    <CardDescription>{service.description}</CardDescription>
                                                                </CardContent>
                                                            </Card>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </div>
            <Drawer
                open={openDrawer}
                onOpenChange={setOpenDrawer}
                onClose={handleCloseDrawer}
            >
                <DrawerContent className={'p-10'}>
                    <DrawerHeader className={'flex flex-row justify-between gap-4'}>
                        <DrawerTitle>Select Service</DrawerTitle>
                        <DrawerTitle
                            className={'font-bold bg-white text-black p-1 rounded-[8px]'}>{selectedService?.price}€</DrawerTitle>
                    </DrawerHeader>
                    <DrawerDescription>
                        <Card>
                            <CardContent>
                                <CardHeader>
                                    <CardTitle>{selectedService?.name}</CardTitle>
                                </CardHeader>
                                <CardDescription>{selectedService?.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </DrawerDescription>
                    <DrawerFooter className={'flex flex-col gap-2 justify-between items-center'}>
                        <div className={' w-full flex flex-row gap-2 justify-between items-center'}>
                            <Button onClick={handleCloseDrawer} variant={'secondary'}>Close</Button>
                            {!cart.find((item) => item.id === selectedService?.id) && (
                                <Button onClick={handleAddToCart}>Add to cart</Button>
                            )}
                            {cart.find((item) => item.id === selectedService?.id) && (
                                <Button onClick={handleRemoveFromCart}
                                        className={'bg-red-600 hover:bg-red-700'}>
                                    <Trash2 className={'text-black dark:text-white'}/>
                                </Button>
                            )}
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Alert className={'fixed top-[25px] right-[48px] w-[25vw]'}>
                <AlertTitle> Cart</AlertTitle>
                <AlertDescription className={'flex flex-row justify-between items-center'}>
                    <span>
                        {totalQuantity} Services
                    </span>
                    <p className={'flex flex-row gap-4 items-center font-extrabold text-primary'}>
                        {totalPrice}€
                        <Link href={'/reservation'}>
                            <Button className={'text-primary text-black dark:text-white'}>reservation</Button>
                        </Link>
                    </p>
                </AlertDescription>
            </Alert>
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services`);
        if (!res.ok) throw new Error(`Failed to fetch services by category, status: ${res.status}`);
        const servicesByCategory = await res.json();
        // categories = [{ name: 'Category 1', services: [{ name: 'Service 1' }] }]
        return {
            props: {
                servicesByCategory,
            },
        };
    } catch (error) {
        console.error('Error fetching services:', error.message, error.stack);
        return {
            props: {
                servicesByCategory: [],
            },
        };
    }
}