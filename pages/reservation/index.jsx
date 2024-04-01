import React,{ useEffect, useState} from 'react';
import Head from 'next/head';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCart } from "@/hooks/useCart"


export const metadata = {
    title: 'Réservation',
    description: 'Réservation de service de coiffure',
}

const formSchema = z.object({
    clientName: z.string().nonempty('Le nom du client est requis'),
    clientEmail: z.string().email('L\'adresse e-mail du client est invalide'),
    clientPhone: z.string().nonempty('Le numéro de téléphone du client est requis'),
    notes: z.string().max(200, 'Les notes ne doivent pas dépasser 200 caractères'),
    date: z.string(),
    timeSlot: z.string(),
    employeeId: z.number(),
    serviceIds: z.array(z.number()),
})

export default function Index() {
    const { cart, removeFromCart, clearCart } = useCart()
    const [cartStore, setCartStore] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [date, setDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            notes: '',
            date: '',
            timeSlot: '',
            employeeId: '',
            serviceIds: []
        }
    });
    const [formValid, setFormValid] = useState(false);
    const {  watch } = form;
    const selectedDate = watch("date");
    const employeeId = watch("employeeId");

    function handleRemoveFromCart( selectedService) {
        removeFromCart(selectedService.id)
        console.log('Service removed from cart:', selectedService)
    }
    const fetchEmployeeAvailability = async (employeeId, formDate ) => {
        try {
            const response = await fetch(`/api/employees/check/${employeeId}/availability?date=${formDate}`);
            console.log('response', response)
            if (!response.ok) {
                throw new Error('Problème lors de la récupération des disponibilités');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des disponibilités:', error);
        }
    };
    const handleSelectEmployee = (employeeId) => {
        setSelectedEmployee(employeeId);
        form.setValue('employeeId', employeeId); // Stocker l'ID de l'employé sélectionné dans le formulaire
    };
    const handleDaySelect = async (day) => {
        setDate(day);
        // Formattez le jour sélectionné pour la requête API
        const formattedDate = format(day, 'yyyy-MM-dd');
        form.setValue('date', formattedDate); // Stocker la date sélectionnée dans le formulaire
        const selectedDayOfWeek = format(day, 'EEEE');

        // Récupérez les disponibilités pour ce jour spécifique
        const employeeAvailability = await fetchEmployeeAvailability(selectedEmployee, formattedDate);
        // Supposez que fetchEmployeeAvailability a été ajustée pour prendre en compte la date spécifique

        // Mettez à jour les créneaux disponibles en filtrant avec le jour de la semaine
        const slotsForDay = employeeAvailability?.weeklyWorkSlots || [];
        setAvailableSlots(slotsForDay);
        console.log(selectedDayOfWeek)
        console.log(employeeAvailability)
    };
    const renderAvailableSlots = () => {
        return availableSlots.map(slot => (
            <Button
                key={slot.id}
                variant={selectedTimeSlot === slot.id ? '' : 'outline'}
                onClick={() => {
                    setSelectedTimeSlot(slot.id);
                    form.setValue('timeSlot', slot.startTime); // Assurez-vous que cela correspond au nom de votre champ dans le schéma du formulaire
                    console.log('Form values:', form.getValues());
                }}
                className="mr-2 mb-2"
            >
                {slot.startTime}
            </Button>
        ));
    };
    const onSubmit = async (data) => {
        if (!selectedEmployee || !date || !selectedTimeSlot || cartStore.length === 0) {
            console.error("Veuillez remplir tous les champs requis.");
            setMessage('Veuillez remplir tous les champs requis.');
            // Affichez un message d'erreur ou une alerte à l'utilisateur si nécessaire
            return;
        }

        setIsOpenAlert(true);
        setLoading(true);
        setProgress(10);
        setMessage('Veuillez patienter pendant que nous traitons votre réservation...');

        try {
            const response = await fetch('/api/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Réservation confirmée', responseData);
                clearCart();
                setProgress(100);
                setLoading(false);
                setCartStore([]);
                setMessage('Votre réservation a été confirmée avec succès.');

            } else {
                console.error('Erreur lors de la soumission');
                setProgress(0);
                setLoading(false);
                setMessage('Erreur lors de la soumission de la réservation.');
            }
        } catch (error) {
            console.error('Erreur lors de l’envoi des données:', error);
            setProgress(0);
            setLoading(false);
            setMessage('Erreur lors de l’envoi des données.');
        }
    };
    const onError = (error) => {
        console.error('Erreur lors de la soumission du formulaire :', error);
        // Affichez un message d'erreur ou une alerte à l'utilisateur si nécessaire
        setMessage(error);
        setIsOpenAlert(true);

        setTimeout(() => {
            setIsOpenAlert(false);
        } , 3000)

    }

    // set the services by cart
    useEffect(() => {
        const nonEmptyCartItems = cart.filter(item => Object.keys(item).length !== 0);
        if (!nonEmptyCartItems.length) {
            console.log('Le panier est vide ou contient des objets non valides.');
            return;
        }
        setCartStore(nonEmptyCartItems);
        const serviceIds = nonEmptyCartItems.map(item => item.id);
        form.setValue('serviceIds', serviceIds);
        const totalPrice = nonEmptyCartItems.reduce((acc, item) => acc + item.price, 0);
        setTotalPrice(totalPrice);
        const fetchEmployeesForService = async (serviceId) => {
            const response = await fetch(`/api/employees/${serviceId}`);
            if (!response.ok) {
                throw new Error(`Échec de la récupération des employés pour le service ${serviceId}, statut : ${response.status}`);
            }
            return response.json();
        };
        const fetchAllEmployees = async () => {
            try {
                // Récupérer les listes d'employés pour chaque service dans le panier.
                const employeeLists = await Promise.all(
                    nonEmptyCartItems.map(service => fetchEmployeesForService(service.id))
                );

                // Calculer les ID communs à tous les services.
                const employeeIdsForAllServices = employeeLists.reduce((commonIds, currentList, index) => {
                    if (index === 0) {
                        return new Set(currentList.map(employee => employee.id));
                    }
                    return new Set(currentList.filter(employee => commonIds.has(employee.id)).map(employee => employee.id));
                }, new Set());

                // Filtrer ou récupérer les employés qui sont communs à tous les services.
                const commonEmployees = employeeLists[0].filter(employee => employeeIdsForAllServices.has(employee.id));

                console.log('Employés pouvant réaliser tous les services sélectionnés :', commonEmployees);
                setEmployees(commonEmployees);
            } catch (error) {
                console.error('Erreur lors de la récupération des employés :', error);
            }
        };
        fetchAllEmployees().then(r => console.log('Employés récupérés pour les services sélectionnés.'));
    }, [cart,form]);

    useEffect(() => {
        if (selectedEmployee) {
            console.log('Form values:', form.getValues());
        }
    }, [selectedEmployee]);

    useEffect(() => {
        console.log(form);
        // check if the form is valid and not empty
        if (form.formState.isValid) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [form.formState.isValid, form.formState.isDirty]);

    return (
      <div>
          <Head>
              <title>{metadata.title}</title>
              <meta name="description" content={metadata.description} />
          </Head>
          <h1 className="text-2xl font-semibold mb-4">Réservation</h1>
          {cartStore.length < 1 ? (
              <div className={'contain-reservation flex flex-row gap-6'}>
                  <Card>
                      <CardContent>
                          <CardHeader>
                              <CardTitle>Votre panier est vide</CardTitle>
                          </CardHeader>
                          <CardDescription>
                              Ajoutez des services à votre panier pour continuer.
                          </CardDescription>
                      </CardContent>
                  </Card>
              </div>
          ) : (
              <div className={'contain-reservation flex flex-row gap-6'}>
                  <div className={'contain-employee-date flex flex-col gap-6 w-1/3'}>
                      <div className={'select-date-employee flex flex-row justify-between gap-4'}>
                          <div className={'select-employee'}>
                              <Select onValueChange={(value) => handleSelectEmployee(value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder={'Sélectionner un employé'}/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectGroup>
                                          <SelectLabel>Employés</SelectLabel>
                                          {employees.map((employee) => (
                                              <SelectItem key={employee.id} value={employee.id}>
                                                  {employee.name}
                                              </SelectItem>
                                          ))}
                                      </SelectGroup>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className={'select-date'}>
                              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                  <PopoverTrigger asChild>
                                      <Button
                                          variant={"outline"}
                                          disabled={!selectedEmployee} // Désactive le bouton si aucun employé n'est sélectionné
                                          className={cn(
                                              "justify-start text-left font-normal",
                                              !date && "text-muted-foreground"
                                          )}
                                          onClick={() => setIsPopoverOpen(true)}
                                      >
                                          <CalendarIcon className="mr-2 h-4 w-4"/>
                                          {date ? format(date, "PPP") : <span>Choisissez une date</span>}
                                      </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                      <Calendar
                                          mode={"single"}
                                          selected={date}
                                          onSelect={(day) => {
                                              handleDaySelect(day);
                                              setIsPopoverOpen(false); // Ferme le Popover lors de la sélection d'une date
                                          }}
                                      />
                                  </PopoverContent>
                              </Popover>
                          </div>
                      </div>
                      <div className={'select-hours'}>
                          <Card>
                              <CardHeader>
                                  <CardTitle>Créneaux disponibles</CardTitle>
                              </CardHeader>
                              <CardContent className={'flex flex-col gap-4'}>
                                  <CardDescription>
                                      {selectedEmployee && availableSlots.length > 0 && date
                                          ? `Créneaux disponibles pour ${employees.find(employee => employee.id === selectedEmployee).name}`
                                          : !selectedEmployee
                                              ? "Sélectionnez un employé pour afficher les créneaux disponibles"
                                              : availableSlots.length === 0
                                                  ? "Aucun créneau disponible pour cet employé à la date sélectionnée"
                                                  : "Sélectionnez un jour pour afficher les créneaux disponibles"}
                                  </CardDescription>
                                  {date && (
                                      <div className={'grid grid-cols-4 gap-4'}>
                                          {renderAvailableSlots()}
                                      </div>
                                  )}
                              </CardContent>
                          </Card>
                      </div>
                  </div>
                  <div className={'contain-form-reservation flex flex-col gap-6 w-2/3'}>
                      <Sheet>
                          <div className={'flex flex-row justify-end'}>
                              <SheetTrigger asChild>
                                  <Button
                                      className={'w-fit bg-white flex flex-row gap-4 text-black hover:text-black dark:text-white'}>
                                      <span className={'font-bold text-2xl'}>
                                            {cartStore.length}
                                      </span>
                                      <ShoppingCart/>
                                  </Button>
                              </SheetTrigger>
                          </div>
                          <SheetContent>
                              <SheetHeader className={'flex flex-col gap-4 justify-between'}>
                                  <SheetClose/>
                                  <SheetTitle className={'flex flex-row justify-between items-center'}>
                                      <span>Mon panier</span>
                                      <span
                                          className={'font-bold text-2xl bg-white text-black rounded-3xl p-4 w-fit h-7 flex flex-row justify-center items-center'}>
                                            <span>{totalPrice}</span>
                                            <span>€</span>
                                    </span>
                                  </SheetTitle>
                              </SheetHeader>
                              <div className="p-4">
                                  {cartStore.map((selectedService) => (
                                      <Card key={selectedService.id} className="mb-4">
                                          <CardHeader>
                                              <CardTitle>{selectedService.name}</CardTitle>
                                          </CardHeader>
                                          <CardContent className={'flex flex-row justify-between'}>
                                          <span
                                              className={'font-bold text-2xl text-primary'}>{selectedService.price} €</span>
                                              <Button
                                                  variant="outline"
                                                  onClick={() => handleRemoveFromCart(selectedService)}
                                              >
                                                  <Trash2/>
                                              </Button>
                                          </CardContent>
                                      </Card>
                                  ))}
                              </div>
                          </SheetContent>
                      </Sheet>
                      <div className={'contain-form-client'}>
                          <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                                  <Card>
                                      <CardHeader>
                                          <CardTitle>Informations du client</CardTitle>
                                      </CardHeader>
                                      <CardContent className={'grid grid-cols-3 gap-4'}>
                                          {/* hidden value input*/}
                                          <FormField
                                              control={form.control}
                                              name={'date'}
                                              render={({field}) => {
                                                  return (<input type="hidden" {...field}/>)
                                              }}/>
                                          <FormField
                                              control={form.control}
                                              name={'timeSlot'}
                                              render={({field}) => {
                                                  return (<input type="hidden" {...field}/>)
                                              }}/>
                                          <FormField
                                              control={form.control}
                                              name={'employeeId'}
                                              render={({field}) => {
                                                  return (<input type="hidden" {...field}/>)
                                              }}/>
                                          <FormField
                                              control={form.control}
                                              name={'serviceIds'}
                                              render={({field}) => {
                                                  return (<input type="hidden" {...field}/>)
                                              }}/>
                                          <FormField
                                              control={form.control}
                                              name={'clientName'}
                                              render={({field}) => {
                                                  return (<FormItem>
                                                          <FormLabel>Nom du client</FormLabel>
                                                          <FormControl>
                                                              <Input {...field}/>
                                                          </FormControl>
                                                          <FormMessage/>
                                                      </FormItem>
                                                  )
                                              }}/>
                                          <FormField
                                              control={form.control}
                                              name={'clientEmail'}
                                              render={({field}) => {
                                                  return (<FormItem>
                                                          <FormLabel>Email du client</FormLabel>
                                                          <FormControl>
                                                              <Input {...field}/>
                                                          </FormControl>
                                                          <FormMessage/>
                                                      </FormItem>
                                                  )
                                              }}/>
                                          <FormField
                                              control={form.control}
                                              name={'clientPhone'}
                                              render={({field}) => {
                                                  return (<FormItem>
                                                          <FormLabel>Téléphone du client</FormLabel>
                                                          <FormControl>
                                                              <Input {...field}/>
                                                          </FormControl>
                                                          <FormMessage/>
                                                      </FormItem>
                                                  )
                                              }}/>
                                          <div
                                              className="col-span-3">
                                              <FormField
                                                  control={form.control}
                                                  name={'notes'}
                                                  render={({field}) => (
                                                      <FormItem>
                                                          <FormLabel>Notes</FormLabel>
                                                          <FormControl>
                                                              <Textarea
                                                                  placeholder="Ajouter des notes..."
                                                                  className="resize-none w-full"
                                                                  {...field}
                                                              />
                                                          </FormControl>
                                                          <FormMessage/>
                                                      </FormItem>
                                                  )}
                                              />
                                          </div>
                                      </CardContent>
                                      <CardFooter>
                                          <Button type="submit"
                                                  className={'w-full'}
                                                  disabled={!selectedTimeSlot || !selectedEmployee || !date || !formValid}
                                          >Réserver</Button>
                                      </CardFooter>
                                  </Card>
                              </form>
                          </Form>
                      </div>
                  </div>
              </div>
          )}
          <AlertDialog open={isOpenAlert} onOpenChange={setIsOpenAlert}>
              <AlertDialogContent>
                  <AlertDialogTitle>Réservation {loading ? 'en cours' : 'terminée'}</AlertDialogTitle>
                  <AlertDialogDescription>
                      {message}
                  </AlertDialogDescription>
                  <Progress value={progress} className="w-full"/>
                  <AlertDialogAction className={'bg-white text-black'}
                                     onClick={() => setIsOpenAlert(false)}>Terminé</AlertDialogAction>
              </AlertDialogContent>
          </AlertDialog>
      </div>
    );
}
