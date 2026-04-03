const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  PermissionsBitField,
  ChannelType
} = require('discord.js');

const fs = require("fs");

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1479938559036227614";
const GUILD_ID = "1482878524841922630";


// ===== VERIFY SYSTEM =====
const UNVERIFIED_ROLE = "1487554862492156014";
const VERIFIED_ROLES = [
  "1487552823683059762",
  "1489285453185159208"
];
const VERIFY_CHANNEL_ID = "1487555154575360120";

// ===== CHANNELS =====
const FULL_LOG_CHANNEL_ID = "1487555326713528494";
const BAN_LOG_CHANNEL = "1487555326713528494";
const INVITE_LOG_CHANNEL = "1487555326713528494";
const MIN_ACCOUNT_AGE_DAYS = 3;

// ===== ROLES =====
const MOD_ROLE_ID = [
  "1487552685673812028",
  "1487552709606248488",
  "1487552730963902707",
  "1482913822955274340"
];
// The RAID COMMANDER is SSU/SSD (person who uses the /ssu command)
const RAID_COMMANDER_ROLE_ID = "1487552685673812028";
const RAID_PING_ROLE_ID = "1487552823683059762";

// ===== TICKET SYSTEM =====
const TICKET_PANEL_CHANNEL = "1487555705400463491";
const TICKET_CATEGORY = "1487555806202171533";
const TICKET_SUPPORT_ROLE = "1487555904390828052";

// ===== RAID PREVENTION SYSTEM =====
const RAID_JOIN_THRESHOLD = 5; // joins
const RAID_TIME_WINDOW = 10000; // ms
const AUTO_LOCKDOWN = true;

// ===== ANTI NUKE SYSTEM =====
const NUKER_THRESHOLD = 3; // actions before punishment
const NUKER_TIME_WINDOW = 10000; // 10 seconds
const AUTO_BAN_NUKERS = true;
const AUTO_LOCKDOWN_ON_NUKE = true;

// ===== DATABASE =====
const LOG_DB = "./playerlogs.json";

// ===== STRIKE + LEVEL + RECRUIT DATABASES =====
const STRIKE_DB = "./strikes.json";
const LEVEL_DB = "./levels.json";
const INVITE_DB = "./invites.json";

let strikeData = fs.existsSync(STRIKE_DB)
  ? JSON.parse(fs.readFileSync(STRIKE_DB))
  : {};

let levelData = fs.existsSync(LEVEL_DB)
  ? JSON.parse(fs.readFileSync(LEVEL_DB))
  : {};

let inviteData = fs.existsSync(INVITE_DB)
  ? JSON.parse(fs.readFileSync(INVITE_DB))
  : {};

function saveStrikes() {
  fs.writeFileSync(STRIKE_DB, JSON.stringify(strikeData, null, 2));
}

function saveLevels() {
  fs.writeFileSync(LEVEL_DB, JSON.stringify(levelData, null, 2));
}

function saveInvites() {
  fs.writeFileSync(INVITE_DB, JSON.stringify(inviteData, null, 2));
}

// ===== RANK ORDER (TOP → BOTTOM FIELD LEADERSHIP ONLY) =====

let playerLogs = fs.existsSync(LOG_DB)
  ? JSON.parse(fs.readFileSync(LOG_DB))
  : {};

function saveLogs() {
  fs.writeFileSync(LOG_DB, JSON.stringify(playerLogs, null, 2));
}

function addLog(userId, type, moderator, reason) {
  if (!playerLogs[userId]) playerLogs[userId] = [];

  playerLogs[userId].push({
    type,
    moderator,
    reason,
    date: new Date().toLocaleString()
  });

  saveLogs();
}

// ===== SESSION MESSAGE TRACKING =====
let lastSSUMessage = null;

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: ["CHANNEL"]
});

// ===== INVITE CACHE SYSTEM =====
let inviteCache = new Map();

client.once("ready", async () => {

  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`Ticket system ready`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return;

  const invites = await guild.invites.fetch();
  inviteCache.set(guild.id, invites);

  const panelChannel = await guild.channels.fetch(TICKET_PANEL_CHANNEL);
  if (!panelChannel) return;

  const headerEmbed = new EmbedBuilder()
.setColor("#2A5CFF")
.setImage("https://cdn.discordapp.com/attachments/1489096700793716817/1489307015787577495/New_Project_6.png");

  const ticketEmbed = new EmbedBuilder()
.setColor("#2A5CFF")
.setTitle("<:info2:1488904572498870533> Support Information")
.setDescription(
"> Welcome to the Support Dashboard! Here you can open a ticket for General, IA, and Management. Trolling or falsely opening tickets may result in you being punished. Please avoid pinging staff with-out valid reason.\n\n" +

"<:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730>\n" +

"<:chat:1488905927896596582> **General Support**\n" +
"> <:CF11:1488888964755492944> General Inquires\n" +
"> <:CF11:1488888964755492944> General Concerns\n" +
"> <:CF11:1488888964755492944> Member Reports\n\n" +

"<:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730>\n" +
  
"<:paint1:1489376215146954983> **Designer Application**\n" +
"> <:CF11:1488888964755492944> Become a Designer\n" +
"> <:CF11:1488888964755492944> Make some Money!\n" +
"> <:CF11:1488888964755492944> Show your talent\n\n" +

"<:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730>\n" +

"<:IA:1488906883648458863> **IA Support**\n" +
"> <:CF11:1488888964755492944> Staff Reports\n" +
"> <:CF11:1488888964755492944> Scam Reports\n" +
"> <:CF11:1488888964755492944> LOA Requests\n" +
"> <:CF11:1488888964755492944> Refund Requests\n\n" +

"<:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730>\n" +

"<:mgmt:1488907498332356820> **Management Support**\n" +
"> <:CF11:1488888964755492944> High Rank Inquires\n" +
"> <:CF11:1488888964755492944> Partnership Requests\n" +
"> <:CF11:1488888964755492944> Role Requests\n\n" +

"<:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730><:D3:1488887648927088730>\n" +

"**⚠️ Important**\n" + 
  "> <:CF11:1488888964755492944> Do not spam tickets\n" + 
  "> <:CF11:1488888964755492944> Provide detailed information\n" + 
  "> <:CF11:1488888964755492944> Be patient while waiting\n\n"
)
.setImage("https://cdn.discordapp.com/attachments/1487555326713528494/1488908758263402556/image.png")
.setFooter({ text: "Developer Hub • Support System" });
  
const row = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("ticket_select")
    .setPlaceholder("Select a ticket type...")
    .addOptions([
      {
        label: "General Support",
        description: "Questions, help, or general issues",
        value: "general_ticket",
        emoji: { id: "1488905927896596582" }
      },
      {
        label: "Internal Affairs",
        description: "Report staff or serious concerns",
        value: "ia_ticket",
        emoji: { id: "1480281879516283071" }
      },
      {
        label: "Management",
        description: "Contact high command",
        value: "mgmt_ticket",
        emoji: { id: "1480283687223427313" }
      },
      {
        label: "Designer Applications",
        description: "Apply to become a designer",
        value: "designer_ticket",
        emoji: { id: "1489376215146954983" }
      }
    ])
);

  const messages = await panelChannel.messages.fetch({ limit: 10 });
const existing = messages.find(m => m.author.id === client.user.id);

if (!existing) {
  await panelChannel.send({
    embeds: [headerEmbed, ticketEmbed],
    components: [row]
  });
}

}); 

// ===== ANTI RAID + AUTO ROLES =====
let recentJoins = [];
let antiNukeTracker = new Map();
let raidMode = false;

client.on("guildMemberAdd", async member => {

  recentJoins.push(Date.now());
  recentJoins = recentJoins.filter(t => Date.now() - t < RAID_TIME_WINDOW);

  // ===== RAID DETECTED =====
  if (recentJoins.length >= RAID_JOIN_THRESHOLD && !raidMode) {

    raidMode = true;

    const logChannel = member.guild.channels.cache.get(FULL_LOG_CHANNEL_ID);

    logChannel?.send("🚨 **RAID DETECTED — LOCKDOWN INITIATED**");

    // DISABLE ALL INVITES
const invites = await member.guild.invites.fetch();
for (const inv of invites.values()) {
  await inv.delete().catch(() => {});
}

    // AUTO LOCKDOWN
    if (AUTO_LOCKDOWN) {
      member.guild.channels.cache.forEach(channel => {
        if (channel.type === ChannelType.GuildText) {
          channel.permissionOverwrites.edit(member.guild.roles.everyone, {
            SendMessages: false
          }).catch(()=>{});
        }
      });
    }

    // AUTO UNLOCK AFTER 10 MIN
    setTimeout(() => {
      raidMode = false;

      member.guild.channels.cache.forEach(channel => {
        if (channel.type === ChannelType.GuildText) {
          channel.permissionOverwrites.edit(member.guild.roles.everyone, {
            SendMessages: true
          }).catch(()=>{});
        }
      });

      logChannel?.send("✅ Raid mode disabled. Server unlocked.");
    }, 10 * 60 * 1000);
  }

  await member.roles.add(UNVERIFIED_ROLE).catch(() => {});
  await member.roles.add(RAID_PING_ROLE_ID).catch(() => {});

  // ===== ALT ACCOUNT PROTECTION =====
const accountAge = (Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);

if (accountAge < MIN_ACCOUNT_AGE_DAYS) {

  await member.kick("Alt account detected (too new)").catch(() => {});

  member.guild.channels.cache
    .get(FULL_LOG_CHANNEL_ID)
    ?.send(`🚫 Kicked alt account: ${member.user.tag} (${accountAge.toFixed(1)} days old)`);

  return;
}

  // ===== BOT JOIN =====
if (member.user.bot) {

  const logChannel = member.guild.channels.cache.get(FULL_LOG_CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setTitle("🤖 Bot Joined")
    .setDescription(`Bot: ${member}\nTag: ${member.user.tag}\n\nApprove or deny this bot.`)
    .setColor("#ff9900")
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`bot_deny_${member.id}`)
      .setLabel("Deny")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId(`bot_confirm_${member.id}`)
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Success)
  );

  logChannel?.send({
    embeds: [embed],
    components: [row]
  });

  return;
}

// ===== INVITE TRACKING =====
const newInvites = await member.guild.invites.fetch();
const oldInvites = inviteCache.get(member.guild.id);

const usedInvite = newInvites.find(inv =>
  oldInvites?.get(inv.code)?.uses < inv.uses
);

if (usedInvite && usedInvite.inviter) {

  const inviter = usedInvite.inviter;
  const inviterId = inviter.id;

  // ACCOUNT AGE CHECK
  const accountAge = (Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);

  if (accountAge < MIN_ACCOUNT_AGE_DAYS) {

    member.guild.channels.cache
      .get(INVITE_LOG_CHANNEL)
      ?.send(`⚠️ Invite from ${inviter.tag} ignored (new account under ${MIN_ACCOUNT_AGE_DAYS} days).`);

  } else {

    if (!inviteData[inviterId]) inviteData[inviterId] = {
      invites: 0,
      users: []
    };

    inviteData[inviterId].invites += 1;
    inviteData[inviterId].users.push(member.id);

    saveInvites();

    member.guild.channels.cache
      .get(INVITE_LOG_CHANNEL)
      ?.send(`📈 ${inviter.tag} invited ${member.user.tag}`);
  }
}

// ===== WELCOME MESSAGE =====
const welcomeChannel = member.guild.channels.cache.get("1482878525286650048");

if (welcomeChannel) {
  welcomeChannel.send(
    `Welcome ${member} to DevHub! We now have ${member.guild.memberCount} members.`
  );
}

// Update cache
inviteCache.set(member.guild.id, newInvites);
});

// ===== REMOVE INVITE IF USER LEAVES =====
client.on("guildMemberRemove", member => {

  for (const inviterId in inviteData) {

    const data = inviteData[inviterId];

    if (data.users && data.users.includes(member.id)) {

      data.users = data.users.filter(id => id !== member.id);
      data.invites -= 1;

      if (data.invites < 0) data.invites = 0;

      saveInvites();

      member.guild.channels.cache
        .get(INVITE_LOG_CHANNEL)
        ?.send(`📉 Invite removed from <@${inviterId}> (user left)`);

      break;
    }
  }
});

// ===== AUTOMOD (UPDATED - NO BYPASS) =====

// Function to normalize stretched words (fuuuck → fuck)
function normalizeWord(word) {
  return word.toLowerCase().replace(/(.)\1+/g, "$1");
}

const bannedWords = [
  "nigger",
  "faggot",
  "fuck",
  "bitch",
  "cunt",
  "retard",
  "whore",
  "slut"
];

// ===== ANTI SPAM SYSTEM =====
const messageTracker = new Map();
const SPAM_LIMIT = 5;
const SPAM_TIME = 3000;

client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  // ===== SPAM CHECK =====
const userId = message.author.id;

if (!messageTracker.has(userId)) {
  messageTracker.set(userId, []);
}

const timestamps = messageTracker.get(userId);
timestamps.push(Date.now());

const filtered = timestamps.filter(time => Date.now() - time < SPAM_TIME);
messageTracker.set(userId, filtered);

if (filtered.length >= SPAM_LIMIT) {

  await message.member.timeout(10 * 60 * 1000).catch(() => {});
  await message.channel.send(`🚫 ${message.author} muted for spamming.`);

  return;
}
  
  const words = message.content.split(/\s+/);

  for (let rawWord of words) {
    const clean = rawWord.replace(/[^a-zA-Z]/g, "");
    const normalized = normalizeWord(clean);

    if (bannedWords.includes(normalized)) {

      await message.delete().catch(() => {});
      await message.member.timeout(30 * 60 * 1000).catch(() => {});

      addLog(
        message.member.id,
        "Prohibited Word",
        "Automod",
        "30 Minute Timeout"
      );

      // DM warning
      await message.author.send(
        "You cannot use that language, you have been issued a warning."
      ).catch(() => {});

      return;
    }
  }
});

// LEVEL SYSTEM
const MAX_LEVEL = 100;

client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  if (!levelData[message.author.id]) {
    levelData[message.author.id] = {
      xp: 0,
      level: 1
    };
  }

  const user = levelData[message.author.id];

  if (user.level >= MAX_LEVEL) return; // STOP at level 100

  const xpGain = Math.floor(Math.random() * 10) + 5;
  user.xp += xpGain;

  const requiredXP = user.level * 100;

  if (user.xp >= requiredXP) {
    user.xp -= requiredXP; // ✅ carry over extra XP instead of wiping
    user.level += 1;

    message.channel.send(
      `🎉 ${message.author} leveled up to Level ${user.level}!`
    );
  }

  saveLevels();
});

// ===== SLASH COMMANDS =====
const commands = [

  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify yourself'),

  new SlashCommandBuilder()
    .setName('ssu')
    .setDescription('Begin the server!'),

new SlashCommandBuilder()
  .setName('ssd')
  .setDescription('End the server session'),

  new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Promote a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role to give').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),

   new SlashCommandBuilder()
  .setName('demote')
  .setDescription('Demote a user')
  .addUserOption(o =>
    o.setName('user')
    .setDescription('User to demote')
    .setRequired(true))
  .addRoleOption(o =>
    o.setName('demoted_to')
    .setDescription('Role they are being demoted to')
    .setRequired(true))
  .addRoleOption(o =>
    o.setName('remove_role')
    .setDescription('Role being removed')
    .setRequired(true))
  .addStringOption(o =>
    o.setName('reason')
    .setDescription('Reason for demotion')
    .setRequired(true)),

  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),

  new SlashCommandBuilder()
    .setName('logs')
    .setDescription('View player logs')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('clearlogs')
    .setDescription('Clear player logs')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Permanently ban a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),

  new SlashCommandBuilder()
    .setName('tban')
    .setDescription('Temporarily ban a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('hours').setDescription('Hours').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))

  ,

  new SlashCommandBuilder()
    .setName('strike')
    .setDescription('Strike a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),

  new SlashCommandBuilder()
  .setName('clearstrikes')
  .setDescription('Clear all strikes from a user')
  .addUserOption(o =>
    o.setName('user')
    .setDescription('User to clear strikes for')
    .setRequired(true)),

  new SlashCommandBuilder()
    .setName('strikes')
    .setDescription('Check strikes')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),

  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true)),

  new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode in current channel')
    .addIntegerOption(o => o.setName('seconds').setDescription('Seconds').setRequired(true)),

  new SlashCommandBuilder()
    .setName('recruitleaderboard')
    .setDescription('Top recruiters'),

new SlashCommandBuilder()
  .setName('myinvites')
  .setDescription('Check how many users you have invited'),

  new SlashCommandBuilder()
    .setName('mylevel')
    .setDescription('Check your level'),

  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('XP leaderboard'),

  new SlashCommandBuilder()
  .setName('lockdown')
  .setDescription('Lock the entire server'),

new SlashCommandBuilder()
  .setName('unlockdown')
  .setDescription('Unlock the server')

];

async function punishNuker(guild, userId, reason) {
  try {
    const member = await guild.members.fetch(userId).catch(() => null);

    if (member && AUTO_BAN_NUKERS) {
      await member.ban({ reason: `Anti-Nuke: ${reason}` }).catch(() => {});
    }

    const logChannel = guild.channels.cache.get(FULL_LOG_CHANNEL_ID);
    logChannel?.send(`🚨 Anti-Nuke triggered on <@${userId}> — ${reason}`);

    if (AUTO_LOCKDOWN_ON_NUKE) {
      guild.channels.cache.forEach(channel => {
        if (channel.type === ChannelType.GuildText) {
          channel.permissionOverwrites.edit(guild.roles.everyone, {
            SendMessages: false
          }).catch(() => {});
        }
      });
    }

  } catch (err) {
    console.log("Anti-nuke error:", err);
  }
}

function trackNukeAction(guild, userId, reason) {
  const now = Date.now();

  if (!antiNukeTracker.has(userId)) {
    antiNukeTracker.set(userId, { count: 1, first: now });
    return;
  }

  const data = antiNukeTracker.get(userId);

  if (now - data.first > NUKER_TIME_WINDOW) {
    data.count = 1;
    data.first = now;
    return;
  }

  data.count++;

  if (data.count >= NUKER_THRESHOLD) {
    punishNuker(guild, userId, reason);
    antiNukeTracker.delete(userId);
    return;
  }

  antiNukeTracker.set(userId, data);
}


// ===== COMMAND HANDLERS (DUAL SUPPORT CORE) =====

async function handleVerify(ctx) {
  if (ctx.channelId !== VERIFY_CHANNEL_ID)
    return ctx.reply("❌ Use this in verify channel.", true);

  if (!ctx.member.roles.cache.has(UNVERIFIED_ROLE))
    return ctx.reply("❌ Already verified.", true);

  await ctx.member.roles.remove(UNVERIFIED_ROLE);
  for (const role of VERIFIED_ROLES) {
    await ctx.member.roles.add(role);
  }

  return ctx.reply("✅ Verified!", true);
}

async function handleRaidCall(ctx, time) {
  if (!ctx.member.roles.cache.has(RAID_COMMANDER_ROLE_ID))
    return ctx.reply("❌ No permission.", true);

  if (!time) return ctx.reply("❌ Provide a time.", true);

  const embed = new EmbedBuilder()
    .setTitle("```TBV RAID```")
    .setDescription(
      `Called by ${ctx.user}\nTime: ${time} EST\n\nReact with ✅ if you are attending.`
    )
    .setColor(0x2b2d31)
    .setTimestamp();

  const message = await ctx.reply({
    content: `<@&${RAID_PING_ROLE_ID}>`,
    embeds: [embed],
    allowedMentions: { roles: [RAID_PING_ROLE_ID] },
    fetchReply: true
  });

  await message.react("✅");
}

// ===== INTERACTIONS =====
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // VERIFY
  if (interaction.commandName === "verify") {

    if (interaction.channelId !== VERIFY_CHANNEL_ID)
      return interaction.reply({ content: "❌ Use this in verify channel.", ephemeral: true });

    if (!interaction.member.roles.cache.has(UNVERIFIED_ROLE))
      return interaction.reply({ content: "❌ Already verified.", ephemeral: true });

    await interaction.member.roles.remove(UNVERIFIED_ROLE);
    for (const role of VERIFIED_ROLES) {
      await interaction.member.roles.add(role);
    }

    return interaction.reply({ content: "✅ Verified!", ephemeral: true });
  }

  // SSU START
  if (interaction.commandName === "ssu") {

    if (!interaction.member.roles.cache.has(RAID_COMMANDER_ROLE_ID))
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });

  const embed = new EmbedBuilder()
  .setTitle("```Florida State SSU```")
  .setDescription(
    "The Staff Team has called an SSU! Join the server with the code: floridav.\n\n" +
    "If you want to have fun in our server, join the server to experience Florida State Roleplay! We hope you have tons of fun and we can't wait to see you in game!"
  )
  .setColor(0x2b2d31)
  .setImage("https://cdn.discordapp.com/attachments/1434641410782400605/1480037200715579503/sessions.webp?ex=69ae378e&is=69ace60e&hm=064d4078f5613232264860b3a01117455187a9ba4e1e80c369f89c44c5f11729")
  .setTimestamp();

const msg = await interaction.reply({
  content: `<@&${RAID_PING_ROLE_ID}>`,
  embeds: [embed],
  allowedMentions: { roles: [RAID_PING_ROLE_ID] },
  fetchReply: true
});

// Save message so SSD can delete it later
lastSSUMessage = msg;
}

// SESSION END
if (interaction.commandName === "ssd") {

  if (!interaction.member.roles.cache.has(RAID_COMMANDER_ROLE_ID))
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });

// Delete previous SSU message
if (lastSSUMessage) {
  try {
    await lastSSUMessage.delete();
    lastSSUMessage = null;
  } catch (err) {
    console.log("Couldn't delete SSU message.");
  }
}

  const embed = new EmbedBuilder()
  .setTitle("```Session Ended```")
  .setDescription(
    `The session has been ended by ${interaction.user}.\n\n` +
    "Join us next time and thank you to everyone who helped and joined the server. " +
    "We hope you had a great time. See you next time!"
  )
  .setColor(0x2b2d31)
  .setImage("https://cdn.discordapp.com/attachments/1434641410782400605/1480037200715579503/sessions.webp?ex=69ae378e&is=69ace60e&hm=064d4078f5613232264860b3a01117455187a9ba4e1e80c369f89c44c5f11729")
  .setTimestamp();

const msg = await interaction.reply({
  content: `<@&${RAID_PING_ROLE_ID}>`,
  embeds: [embed],
  allowedMentions: { roles: [RAID_PING_ROLE_ID] },
  fetchReply: true
});

// Delete SSD message after 10 minutes
setTimeout(() => {
  msg.delete().catch(() => {});
}, 10 * 60 * 1000);
}

  // PROMOTE
if (interaction.commandName === "promote") {

  if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });

  const user = interaction.options.getUser("user");
  const role = interaction.options.getRole("role"); // ✅ FIX ADDED
  const reason = interaction.options.getString("reason") || "No reason provided";

  const member = await interaction.guild.members.fetch(user.id).catch(() => null);

  if (!member)
    return interaction.reply({ content: "User not found in server.", ephemeral: true });

  // GIVE ROLE
  await member.roles.add(role).catch(() => {});

  // LOG
  addLog(member.id, "Promotion", interaction.user.tag, reason);

  // EMBED
  const embed = new EmbedBuilder()
    .setTitle("Staff Promotion")
    .setDescription(
      `Congratulations! ${member} has been promoted by ${interaction.user}.`
    )
    .addFields(
      { name: "Staff Member", value: `${member}`, inline: false },
      { name: "New Rank", value: `${role}`, inline: false },
      { name: "Reason", value: `${reason}`, inline: false }
    )
    .setColor("#f1c40f")
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: `Promotion issued by ${interaction.user.tag}` })
    .setTimestamp();

  const channel = interaction.guild.channels.cache.get("1489097136929902624");

  if (channel) {
    channel.send({
      content: `${member}`,
      embeds: [embed]
    });
  }

  return interaction.reply({
    content: "✅ Promotion sent.",
    ephemeral: true
  });
}
  
 // DEMOTE
if (interaction.commandName === "demote") {

  if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });

  const member = interaction.options.getMember("user");
  const demotedRole = interaction.options.getRole("demoted_to");
  const removeRole = interaction.options.getRole("remove_role");
  const reason = interaction.options.getString("reason");

  // Remove old role
  await member.roles.remove(removeRole).catch(()=>{});

  // Give new role
  await member.roles.add(demotedRole).catch(()=>{});

  addLog(member.id, "Demotion", interaction.user.tag, reason);

  const embed = new EmbedBuilder()
    .setTitle("<:florida2:1478801582056538305> Demotion")
    .setDescription(`${member} has been demoted to ${demotedRole}. Please follow the rules and do your duties as a staff next time.`)
    .addFields(
      { name: "Person", value: `${member}`, inline: false },
      { name: "New Role", value: `${demotedRole}`, inline: false },
      { name: "Reason", value: `${reason}`, inline: false }
    )
    .setColor("#2b2d31")
    .setThumbnail(member.user.displayAvatarURL())
    .setFooter({ text: `Demoted by ${interaction.user.tag}` })
    .setTimestamp();

  const channel = interaction.guild.channels.cache.get("1489097083029033060");

  if (channel) {
    channel.send({
      content: `${member}`,
      embeds: [embed]
    });
  }

  return interaction.reply({
    content: "✅ Demotion sent.",
    ephemeral: true
  });
}

  // WARN
  if (interaction.commandName === "warn") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
  return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    addLog(user.id, "Warning", interaction.user.tag, reason);

    await interaction.reply({ content: `⚠️ ${user.tag} warned.` });
setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
  }

  // LOGS
  if (interaction.commandName === "logs") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const logs = playerLogs[user.id];

    if (!logs || logs.length === 0)
      return interaction.reply({ content: "No logs found.", ephemeral: true });

    const formatted = logs.map(l =>
      `• [${l.date}] ${l.type} | ${l.moderator} | ${l.reason}`
    ).join("\n");

    return interaction.reply({ content: formatted, ephemeral: true });
  }

  // CLEAR LOGS
  if (interaction.commandName === "clearlogs") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    playerLogs[user.id] = [];
    saveLogs();

    await interaction.reply({ content: `🧹 Logs cleared.` });
setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
  }

 // STRIKE
if (interaction.commandName === "strike") {

  if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });

  const user = interaction.options.getUser("user");
  const reason = interaction.options.getString("reason");
  const member = interaction.guild.members.cache.get(user.id);

  if (!strikeData[user.id]) strikeData[user.id] = 0;

  strikeData[user.id] += 1;
  saveStrikes();

  const strikes = strikeData[user.id];

  // Embed
  const embed = new EmbedBuilder()
    .setTitle("<:dh:1487558730642882861> Strike")
    .setDescription(`${user} has been issued a strike by ${interaction.user}. Please do not continue to do so or else you will face other consequences.`)
    .addFields(
      { name: "> User", value: `${user}`, inline: false },
      { name: "> Punishment", value: `Strike ${strikes}`, inline: false },
      { name: "> Reason", value: `${reason}`, inline: false }
    )
    .setColor("#2b2d31")
    .setThumbnail(user.displayAvatarURL())
    .setFooter({ text: `Strike issued by ${interaction.user.tag}` })
    .setTimestamp();

  const channel = interaction.guild.channels.cache.get("1489097083029033060");

  if (channel) {
    channel.send({
      content: `${user}`,
      embeds: [embed]
    });
  }

  await interaction.reply({
    content: "✅ Strike issued.",
    ephemeral: true
  });

    // AUTO 48H TEMP BAN AT 5 STRIKES

if (strikes === 5 && member) {

  await member.ban({ reason: "5 Strikes - 48 Hour Temp Ban" });

  setTimeout(() => {
    interaction.guild.members.unban(user.id).catch(() => {});
  }, 48 * 60 * 60 * 1000);
}

}

  // CHECK STRIKES
  if (interaction.commandName === "strikes") {
    const user = interaction.options.getUser("user");
    const strikes = strikeData[user.id] || 0;

    return interaction.reply({ content: `${user.tag} has ${strikes} strike(s).`, ephemeral: true });
  }

  // MUTE
  if (interaction.commandName === "mute") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const member = interaction.options.getMember("user");
    const minutes = interaction.options.getInteger("minutes");

    await member.timeout(minutes * 60 * 1000);

    return interaction.reply(`${member.user.tag} muted for ${minutes} minutes.`);
  }

  // CLEAR STRIKES
if (interaction.commandName === "clearstrikes") {

  if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });

  const user = interaction.options.getUser("user");

  strikeData[user.id] = 0;
  saveStrikes();

  return interaction.reply({
    content: `✅ Cleared all strikes for ${user.tag}.`
  });

}

  // SLOWMODE
  if (interaction.commandName === "slowmode") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const seconds = interaction.options.getInteger("seconds");

    await interaction.channel.setRateLimitPerUser(seconds);

    return interaction.reply(`Slowmode set to ${seconds} seconds.`);
  }

    // LOCKDOWN
  if (interaction.commandName === "lockdown") {

    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    interaction.guild.channels.cache.forEach(channel => {

      if (channel.type === ChannelType.GuildText) {

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: false
        }).catch(()=>{});

      }

    });

    return interaction.reply("🔒 Server lockdown enabled.");
  }

  // UNLOCKDOWN
  if (interaction.commandName === "unlockdown") {

    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    interaction.guild.channels.cache.forEach(channel => {

      if (channel.type === ChannelType.GuildText) {

        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: true
        }).catch(()=>{});

      }

    });

    return interaction.reply("🔓 Server lockdown removed.");
  }

  // BAN
  if (interaction.commandName === "ban") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
const reason = interaction.options.getString("reason") || "No reason provided";
const member = await interaction.guild.members.fetch(user.id).catch(() => null);

if (!member) {
  return interaction.reply({
    content: "User is not in this server.",
    ephemeral: true
  });
}
    addLog(user.id, "Permanent Ban", interaction.user.tag, reason);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag} | Ban`)
      .setDescription(`Banned by ${interaction.user.tag}\nReason: ${reason}`)
      .setColor(0xff0000)
      .setTimestamp();

    interaction.guild.channels.cache.get(BAN_LOG_CHANNEL)?.send({ embeds: [embed] });

    await interaction.reply({ content: `${user.tag} banned.` });
setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
  }

  // TEMP BAN
  if (interaction.commandName === "tban") {
    if (!interaction.member.roles.cache.some(role => MOD_ROLE_ID.includes(role.id)))
      return interaction.reply({ content: "❌ No permission.", ephemeral: true });

    const user = interaction.options.getUser("user");
    const hours = interaction.options.getInteger("hours");
    const reason = interaction.options.getString("reason");
    const member = interaction.guild.members.cache.get(user.id);

    await member.ban({ reason: `${reason} (${hours}h)` });
    addLog(user.id, "Temp Ban", interaction.user.tag, reason);

    setTimeout(() => {
      interaction.guild.members.unban(user.id).catch(() => {});
    }, hours * 60 * 60 * 1000);

    await interaction.reply({ content: `${user.tag} banned for ${hours} hours.` });
setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
  }

  // MY LEVEL
  if (interaction.commandName === "mylevel") {

    const data = levelData[interaction.user.id];

    if (!data)
      return interaction.reply({ content: "You have no XP yet.", ephemeral: true });

    const requiredXP = data.level * 100;

    return interaction.reply({
      content: `Level: ${data.level}\nXP: ${data.xp}/${requiredXP}`,
      ephemeral: true
    });
  }

  // XP LEADERBOARD
  if (interaction.commandName === "leaderboard") {

    const sorted = Object.entries(levelData)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 10);

    if (sorted.length === 0)
      return interaction.reply("No data yet.");

    const leaderboard = sorted
      .map((user, index) => {
        const member = interaction.guild.members.cache.get(user[0]);
        const name = member ? member.user.tag : "Unknown";
        return `${index + 1}. ${name} — Level ${user[1].level}`;
      })
      .join("\n");

    return interaction.reply({
      content: `🏆 **XP Leaderboard**\n\n${leaderboard}`
    });
  }

  // RECRUIT LEADERBOARD
  if (interaction.commandName === "recruitleaderboard") {

    const sorted = Object.entries(inviteData)
      .sort((a, b) => b[1].invites - a[1].invites)
      .slice(0, 10);

    if (sorted.length === 0)
      return interaction.reply("No recruitment data yet.");

    const leaderboard = sorted
      .map((user, index) => {
        const member = interaction.guild.members.cache.get(user[0]);
        const name = member ? member.user.tag : "Unknown";
        return `${index + 1}. ${name} — ${user[1].invites} invites`;
      })
      .join("\n");

    return interaction.reply({
      content: `📈 **Recruitment Leaderboard**\n\n${leaderboard}`
    });
  }
  // MY INVITES
  if (interaction.commandName === "myinvites") {

    const data = inviteData[interaction.user.id];

    if (!data)
      return interaction.reply({ content: "You have 0 invites.", ephemeral: true });

    return interaction.reply({
      content: `📊 You have invited ${data.invites} member(s).`,
      ephemeral: true
    });
  }

});

// ===== REGISTER SLASH COMMANDS =====
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🔄 Refreshing application (/) commands...");

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands.map(cmd => cmd.toJSON()) }
    );

    console.log("✅ Slash commands registered.");
  } catch (error) {
    console.error(error);
  }
})();

// ===== READY =====

client.on("interactionCreate", async interaction => {

if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

// ===== DESIGNER APPLICATION APPROVE/DENY =====
if (interaction.isButton() && interaction.customId.startsWith("app_")) {

  const isMod = interaction.member.roles.cache.some(role =>
    MOD_ROLE_ID.includes(role.id)
  );

  if (!isMod) {
    return interaction.reply({ content: "❌ No permission.", ephemeral: true });
  }

  const parts = interaction.customId.split("_");
  const action = parts[1];
  const userId = parts[2];

  const member = await interaction.guild.members.fetch(userId).catch(() => null);

  if (!member) {
    return interaction.reply({ content: "User not found.", ephemeral: true });
  }

  if (action === "approve") {
  const member = await interaction.guild.members.fetch(userId).catch(() => null);

  if (member) {
    member.send("You have been accepted! Welcome aboard!").catch(() => {});
  }

  return interaction.update({
    content: `✅ Approved by ${interaction.user.tag}`,
    components: []
  });
}

  // DENY
 if (action === "deny") {
  const member = await interaction.guild.members.fetch(userId).catch(() => null);

  if (member) {
    member.send(
      "You were not selected for the Designer Team. You may re-apply in 72 hours."
    ).catch(() => {});
  }

  return interaction.update({
      content: `❌ Denied by ${interaction.user.tag}`,
      components: []
    });
  }

} // closes app_ block

// ===== BOT APPROVAL SYSTEM =====
if (interaction.isButton() && interaction.customId.startsWith("bot_")) {

  const isMod = interaction.member.roles.cache.some(role =>
    MOD_ROLE_ID.includes(role.id)
  );

  if (!isMod) {
    return interaction.reply({
      content: "❌ Only moderators can use this.",
      ephemeral: true
    });
  }

  const [action, type, userId] = interaction.customId.split("_");

  if (action === "bot" && type === "deny") {

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    if (!member) {
      return interaction.reply({ content: "Bot not found.", ephemeral: true });
    }

    await member.kick("Bot denied by moderator").catch(() => {});

    await interaction.update({
      content: `❌ Bot ${member.user.tag} was denied and kicked by ${interaction.user.tag}`,
      embeds: [],
      components: []
    });
  }

  if (action === "bot" && type === "confirm") {

    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    if (!member) {
      return interaction.reply({ content: "Bot not found.", ephemeral: true });
    }

    await interaction.update({
      content: `✅ Bot ${member.user.tag} was approved by ${interaction.user.tag}`,
      embeds: [],
      components: []
    });
  }
}

// === CLAIM TICKET === //
if (interaction.customId === "claim_ticket") {

  if (!interaction.member.roles.cache.has(TICKET_SUPPORT_ROLE)) {
    return interaction.reply({ content: "❌ Only ticket staff can claim tickets.", ephemeral: true });
  }

  const claimEmbed = new EmbedBuilder()
    .setTitle("**Ticket Claimed**")
    .setDescription(`Your ticket has been claimed by ${interaction.user.tag}`)
    .setColor("#2b2d31")
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("claim_ticket")
      .setLabel("Claimed")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)
  );

  await interaction.message.edit({ embeds: [claimEmbed], components: [row] });

  const oldName = interaction.channel.name;
  let newName = oldName.replace("🔴-", "");
  newName = `🟢-${newName}`;

  await interaction.channel.setName(newName).catch(() => {});

  await interaction.deferUpdate();
} // ✅ closes claim_ticket
  
/* OPEN TICKET */

if (
  (interaction.isStringSelectMenu() && interaction.customId === "ticket_select") ||
  (interaction.isButton() && interaction.customId.endsWith("_ticket"))
)
{

const user = interaction.user;
const guild = interaction.guild;

let type;

if (interaction.isStringSelectMenu()) {
  type = interaction.values[0];
} else {
  type = interaction.customId;
}

let name;
let title;

const cleanName = user.username.toLowerCase().replace(/[^a-z0-9]/g, "");

if (type === "general_ticket") {
name = `🔴-general-${cleanName}`;
title = "General Support";
}

if (type === "ia_ticket") {
name = `🔴-ia-${cleanName}`;
title = "Internal Affairs Support";
}

if (type === "mgmt_ticket") {
name = `🔴-mgmt-${cleanName}`;
title = "Management Support";
}

if (type === "designer_ticket") {
  name = `🔴-designer-${cleanName}`;
  title = "Designer Application";
}

const channel = await guild.channels.create({
name: name,
type: ChannelType.GuildText,
parent: TICKET_CATEGORY,

permissionOverwrites: [

{
id: guild.id,
deny: [PermissionsBitField.Flags.ViewChannel]
},

{
id: user.id,
allow: [
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
},

{
id: TICKET_SUPPORT_ROLE,
allow: [
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
}

]
});

const embed = new EmbedBuilder()
.setTitle(title)
.setDescription(
  type === "designer_ticket"
    ? "Thank you for opening an application! Please answer the following questions and send any images that showcase your previous work."
    : "Thank you for opening a ticket! A applications team member will be with you shortly to provide the full list of questions.\n\n" +
      "**Please provide:**\n" +
      "<:CF11:1488888964755492944> Q1 - What is your Roblox Username?\n" +
      "<:CF11:1488888964755492944> Q2 - What is your main skill? GFX, Liveries, etc.\n" +
      "<:CF11:1488888964755492944> Q3 - Please provide a portfolio or images of previous work.\n"
)
.setColor("#2A5CFF")
.setTimestamp();

const buttons = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("close_ticket")
.setLabel("Close")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId("claim_ticket")
.setLabel("Claim")
.setStyle(ButtonStyle.Success)

);

channel.send({
embeds: [embed],
components: [buttons]
});

interaction.reply({
content: `Ticket created: ${channel}`,
ephemeral: true
});
}

/* CLOSE TICKET */

if (interaction.customId === "close_ticket") {

  if (!interaction.member.roles.cache.has(TICKET_SUPPORT_ROLE)) {
    return interaction.reply({
      content: "❌ Only ticket staff can close tickets.",
      ephemeral: true
    });
  }

  const channel = interaction.channel;

  await interaction.reply({
    content: "🗑️ Closing ticket...",
    ephemeral: true
  });

  setTimeout(() => {
    channel.delete().catch(() => {});
  }, 2000);
}

});

client.on("channelDelete", async channel => {
  const guild = channel.guild;
  if (!guild) return;

  const logs = await guild.fetchAuditLogs({ type: 12, limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executorId = entry.executor?.id;
  if (!executorId) return;

  trackNukeAction(guild, executorId, "Channel Deletion");
});

client.on("guildBanAdd", async ban => {
  const guild = ban.guild;

  const logs = await guild.fetchAuditLogs({ type: 22, limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executorId = entry.executor?.id;
  if (!executorId) return;

  trackNukeAction(guild, executorId, "Mass Ban Activity");
});

client.on("roleDelete", async role => {
  const guild = role.guild;

  const logs = await guild.fetchAuditLogs({ type: 32, limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executorId = entry.executor?.id;
  if (!executorId) return;

  trackNukeAction(guild, executorId, "Role Deletion");
  
});

client.login(TOKEN);
