#!/usr/bin/env node

import { intro, outro, text, select, isCancel, cancel } from '@clack/prompts';
import chalk from "chalk";
import figlet from "figlet";
import notifier from "node-notifier";
import { Command } from 'commander';

const program = new Command();

async function main() {

    intro('Welcome to SnoreToast!');

    const purpose = await select({
        message: 'What do you want today?',
        options: [
            { value: 'break', label: 'Set a Break' },
            { value: 'reminder', label: 'Set a Reminder' },
        ]
    })

    if (isCancel(purpose)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    if(purpose == 'reminder') setReminder();

    if(purpose == 'break') setBreak();
}

async function setBreak() {

    const timing = await select({
        message: 'Take a break after: ',
        options: [
        { value: '30', label: '30 mins' },
        { value: '45', label: '45 mins' },
        { value: '60', label: '1 hr' },
        { value: '120', label: '2 hr' },
        ],
    });

    if (isCancel(timing)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    const msg1 = 'Take a Break';
    const msg2 = 'Have a Choco!';
    const msg3 = 'Screen off, life on!';
    const msg4 = 'Snacks Time!'
    const msg5 = 'Stand up, lazy bones!';
    const msg6 = 'Brain needs Timeout!'

    const randNo = Math.floor(Math.random() * 6) + 1;

    const triggerReminder = () => {

        // Fancy ASCII banner
        figlet("⏰ BREAK TIME", (err, data) => {
            if (!err) console.log(chalk.yellow(data));
            if (randNo % 6 == 1) console.log('📢', chalk.blue.bold(`${msg1}`));
            if (randNo % 6 == 2) console.log('📢', chalk.blue.bold(`${msg2}`));
            if (randNo % 6 == 3) console.log('📢', chalk.blue.bold(`${msg3}`));
            if (randNo % 6 == 4) console.log('📢', chalk.blue.bold(`${msg4}`));
            if (randNo % 6 == 5) console.log('📢', chalk.blue.bold(`${msg5}`));
            if (randNo % 6 == 0) console.log('📢', chalk.blue.bold(`${msg6}`));
        });

        // 🔔 Send a desktop notification
        notifier.notify({
            title: "⏰ Alert",
            message: "Take a break!",
            sound: true, 
            wait: false,
            timeout: 5, // Notification disappears after 5 seconds
        });
    };

    const timer = Number(timing) * 60 * 1000;

    setTimeout(triggerReminder, timer);

    outro(chalk.green(`⏳ Countdown begins for break, ${timing} mins left...`));

    console.log('Thanks for using my CLI App!')
}

async function setReminder() {

    const reminderName = await text({
        message: 'Name your Reminder :',
        placeholder: ' Have a break, have a KitKat!',
        validate(value) {
        if (value.length === 0) return 'Name is required!';
        },
    });

    if (isCancel(reminderName)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    const timing = await select({
        message: "I'll remind you after:",
        options: [
        { value: '30', label: '30 mins' },
        { value: '45', label: '45 mins' },
        { value: '60', label: '1 hr' },
        { value: '120', label: '2 hr' },
        ],
    });

    if (isCancel(timing)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    const triggerReminder = () => {

        // Fancy ASCII banner
        figlet("⏰ REMINDER", (err, data) => {
            if (!err) console.log(chalk.yellow(data));
            console.log(chalk.blue.bold(`📢 ${reminderName}`))
        });

        // 🔔 Send a desktop notification 
        notifier.notify({
            title: "⏰ Reminder!",
            message: `${reminderName}`,
            sound: true, 
            wait: false,
            timeout: 5, // Notification disappears after 5 seconds
        });

    };

    const timer = Number(timing) * 60 * 1000;

    setTimeout(triggerReminder, timer);

    outro(chalk.green(`⏳ Timer set for ${timing} minutes, Reminder: ${reminderName}`));

    console.log('Thanks for using my CLI App!')
}

    program.command('start').action(main);

    main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
    });