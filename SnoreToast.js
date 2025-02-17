#!/usr/bin/env node

import { intro, outro, text, select, isCancel, cancel } from '@clack/prompts';
import chalk from "chalk";
import figlet from "figlet";
import notifier from "node-notifier";
import { Command } from 'commander';

const program = new Command();

// Main function
async function main() {
    intro('Welcome to SnoreToast!');

    const purpose = await select({
        message: 'What do you want today?',
        options: [
            { value: 'break', label: 'Set a Break' },
            { value: 'reminder', label: 'Set a Reminder' },
        ]
    });

    if (isCancel(purpose)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    if (purpose === 'reminder') await setReminder();
    if (purpose === 'break') await setBreak();
}

// Break Reminder
async function setBreak() {
    const timing = await select({
        message: 'Take a break after:',
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

    const messages = [
        'Take a Break',
        'Have a Choco!',
        'Screen off, life on!',
        'Snacks Time!',
        'Stand up, lazy bones!',
        'Brain needs Timeout!'
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    const triggerReminder = () => {
        figlet("⏰ BREAK TIME", (err, data) => {
            if (!err) console.log(chalk.yellow(data));
            console.log(chalk.blue.bold(`📢 ${randomMsg}`));
        });

        notifier.notify({
            title: "⏰ Alert",
            message: "Take a break!",
            sound: true,
            wait: false,
            timeout: 5, 
        });
    };

    const timer = Number(timing) * 60 * 1000;
    setTimeout(triggerReminder, timer);

    outro(chalk.green(`⏳ Countdown begins for break, ${timing} mins left...`));
    console.log('Thanks for using SnoreToast CLI Tool!')
}

// Custom Reminder
async function setReminder() {
    const reminderName = await text({
        message: 'Name your Reminder:',
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
        figlet("⏰ REMINDER", (err, data) => {
            if (!err) console.log(chalk.yellow(data));
            console.log(chalk.blue.bold(`📢 ${reminderName}`));
        });

        notifier.notify({
            title: "⏰ Reminder!",
            message: reminderName,
            sound: true,
            wait: false,
            timeout: 5,
        });
    };

    const timer = Number(timing) * 60 * 1000;
    setTimeout(triggerReminder, timer);

    outro(chalk.green(`⏳ Reminder set for ${timing} minutes: "${reminderName}"`));
    console.log('Thanks for using SnoreToast CLI Tool!')
}

// CLI Commands Setup
program
    .name("snoretoast")
//     .description("A simple CLI tool for reminders and break notifications")
    .version("1.0.23");

program
    .command("start")
    .description("Start the SnoreToast CLI")
    .action(main);

program
    .command("help")
    .description("Show available commands")
    .action(() => {
        console.log(`
        Usage:
        snoretoast --version            Shows Current Version
        snoretoast start                Start the CLI tool
        snoretoast --help               Show help commands
        npm uninstall -g snoretoast     Uninstall the tool globally
        npm install -g snoretoast       Install the tool globally

        - Read docs for further refernce at https://github.com/githubxnishant/SnoreToast#readme 
        `);
    });

program.exitOverride().configureOutput({
    writeErr: (str) => {
        if (str.includes("unknown command")) {
            console.log(chalk.red.bold("⚠️  Invalid command! Use `snoretoast --help` to see available commands."));
        } else {
            console.error(str);
        }
    }
});
    
try {
    program.parse(process.argv);
} catch (err) {
    process.exit(1);
}
