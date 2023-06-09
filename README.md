<pre>
   ___                _    ___              __        __ _
  / _ \___   ___   __| |  /   \__ _ _   _  / _\ ___  / _| |___      ____ _ _ __ ___
 / /_\/ _ \ / _ \ / _` | / /\ / _` | | | | \ \ / _ \| |_| __\ \ /\ / / _` | '__/ _ \
/ /_\\ (_) | (_) | (_| |/ /_// (_| | |_| | _\ \ (_) |  _| |_ \ V  V / (_| | | |  __/
\____/\___/ \___/ \__,_/___,' \__,_|\__, | \__/\___/|_|  \__| \_/\_/ \__,_|_|  \___|
                                    |___/
                       xkOO00OOkxx                   xkOOOOOOkxx
                   xk0KNNWMMMMWWNX0kx             kOKXNWWMMMMWNXKOx
                  kKNWMMWWWNNNWWMMMWXOx         kKNWMMMWWNNNWWMMMWX0x
                x0NMMMWX0Okxxkk0KNMMMWKk      xONWMMWX0OkkxkkOKNWMMWXk
               x0NWMWXOx         kKWMMWKk     ONMMMXOx         k0NMMWXk
               ONMMWXk            x0WMMW0    kXWMMXk             0WMMWKx
               0WMMW0              kXMMMKx   ONMMW0x             kXMMMXk
               0WMMW0              kXMMMKx   ONMMW0x             kXMMWXk
               kXMMMXk            xKWMMW0    kXWMMNO            x0WMMW0x
               xONMMWXOx        xkKWMMWKx     ONMMMN0x        xkKWMMWKk
                xONWMMWXKOOkkkO0XWMMMN0x       OXWMMWNK0OkkkO0KNMMMWKk
                  k0NWMMMMWWWWWMMMWNKkx         x0XWMMMMWWWWWMMMMWXOx
                    xOKXNWWWWWWNXK0kx             xO0XNWWWWWWNXK0kx
                       xxkkOOOkkx                    xxkOOOOkkx
               xk0K0k                                           xOKKOx
               OXWMWNK0kx                                   xkOKNWMWN0x
               xOKNWMMWWNK0OOkxxx                    xxkkO0KXNWMMWNX0k
                  kOKXNWMMMMWWNXXKKK00000OOOO0000KKKXXNWWMMMMWWNK0kx
                     xkO0KXNNWWMMMMMMMMMMMMMMMMMMMMMMMWWWNXK0Okx
                          xxkOOO0KKKXXXXXXXXXXXXXKKK00OOkxx
                                     xxxxxxxxxxx
</pre>

### Coding Exercise

We are building software for brands that sell their products online. We will provide software to them to manage purchase orders, allocate stock from these purchase orders that will be pushed up to the sales  update their inventory levels. This coding exercise is meant to explore these concepts to give each candidate an idea of what real world problems we are looking to solve, to give us a chance to see what it’s like to work together, all while assessing the candidates development skills.

### Requirements

- Ability to see a list of purchase orders, create, and edit them
- Sensible validation for creation and editing of fields
- Error handling for the validation
- Test coverage

### Starting Point

- Monorepo with NestJS and NextJS powered application
- Seeded database

### To Start Exercise
 - Run `npm install`
 - Run `npx nx run api:serve:development`
 - Run `npx nx run client:serve:development`

### Schema
Here is the schema we will use for this exercise.
<pre>

              ┌───────────────────┐            ┌───────────────────────────┐
              │                   │            │                           │
              │  purchase_orders  ├───────────<│  purchase_order_variants  │
              │                   │            │                           │
              └───────────────────┘            └───────────────────────────┘
                                                             V
                                                             │
                                                             │
                                                             │
                   ┌─────────┐                        ┌──────┴─────┐
                   │         │                        │            │
                   │  items  ├───────────────────────<│  variants  │
                   │         │                        │            │
                   └─────────┘                        └────────────┘
</pre>

### Explorations
Now that the requirements above have been completed, let's explore the following concepts and questions:

- What sort of changes would we need to make to variants and purchase orders to support multiple locations?
- It's important to understand the cost of goods sold in order to understand our profit margin. What if the cost changes per purchase order?
- A merchant wants to maximize the sales they have. We want to make sure they are able to sell stock they have on order. Presently Shopify only has the ability to sell stock that is on hand. Let’s talk through how we would implement presale and backorder on this sales channel.
