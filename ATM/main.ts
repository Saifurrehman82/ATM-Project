import inquirer from "inquirer";


type User = {
  id: string;
  pin: string;
  balance: number;
};

// Generate random user data
const generateRandomUser = (): User => {
  const id = Math.random().toString(36).substring(2, 8); // Generate a random user ID
  const pin = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit PIN
  const balance = Math.floor(Math.random() * 10000); // Random balance between 0 and 9999
  return { id, pin, balance };
};

const user: User = generateRandomUser();

const validateUser = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter your user ID:'
    },
    {
      type: 'password',
      name: 'userPin',
      message: 'Enter your user PIN:',
      mask: '*'
    }
  ]);

  if (answers.userId === user.id && answers.userPin === user.pin) {
    console.log('\nLogin successful!\n');
    await atmFunctions();
  } else {
    console.log('\nInvalid user ID or PIN. Please try again.\n');
    await validateUser();
  }
};

const atmFunctions = async () => {
  const choices = ['Check Balance', 'Deposit Money', 'Withdraw Money', 'Exit'];
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select an option:',
      choices
    }
  ]);

  switch (choice) {
    case 'Check Balance':
      console.log(`\nYour current balance is $${user.balance.toFixed(2)}\n`);
      break;
    case 'Deposit Money':
      await depositMoney();
      break;
    case 'Withdraw Money':
      await withdrawMoney();
      break;
    case 'Exit':
      console.log('\nThank you for using our ATM. Goodbye!\n');
      return;
  }

  await atmFunctions();
};

const depositMoney = async () => {
  const { amount } = await inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: 'Enter the amount to deposit:',
      validate: (input: string) => {
        const value = parseFloat(input);
        if (isNaN(value) || value <= 0) {
          return 'Please enter a valid positive number.';
        }
        return true;
      }
    }
  ]);

  user.balance += parseFloat(amount);
  console.log(`\nYou have successfully deposited $${amount}. Your new balance is $${user.balance.toFixed(2)}\n`);
};

const withdrawMoney = async () => {
  const { amount } = await inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: 'Enter the amount to withdraw:',
      validate: (input: string) => {
        const value = parseFloat(input);
        if (isNaN(value) || value <= 0) {
          return 'Please enter a valid positive number.';
        }
        if (value > user.balance) {
          return 'Insufficient balance.';
        }
        return true;
      }
    }
  ]);

  user.balance -= parseFloat(amount);
  console.log(`\nYou have successfully withdrawn $${amount}. Your new balance is $${user.balance.toFixed(2)}\n`);
};

// Start the ATM application
(async () => {
  console.log('\nWelcome to the ATM\n');
  await validateUser();
})();
