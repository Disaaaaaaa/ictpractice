# Paper 1-2-3 learning objectives vs the 2026-2027 KTP

**Status: resolved.** The 27 missing and 13 partially covered objectives are now linked to topics
with their Paper-document codes (`code@paper`): 11 exam-only topics (`paper-*`, shown under Exam Papers
and at the end of Learn & Practice) and 6 existing topics. Configuration: `EXAM_ONLY_TOPICS` and
`PAPER_LINKS` in `scripts/import_curriculum.py`.

Paper document: 159 objectives. Same code and meaning: 60. Same meaning under another KTP code: 59. Partially covered: 13. **Not in the 2026-2027 KTP at all: 27.**

## Not covered by any 2026-2027 topic

| Paper | Section | Code | Objective |
|---|---|---|---|
| 1 | 1.2 Information security | 11.1.2.6 | explain the function and operation of Blockchain technologies |
| 1 | 1.3 Ethics and ownership | 11.1.3.2 | describe specifics of open source software |
| 1 | 1.3 Ethics and ownership | 11.1.3.3 | describe specifics of closed source software |
| 1 | 1.3 Ethics and ownership | 11.1.3.5 | evaluate risks of using cloud technologies |
| 1 | 3.4 Memory | 11.3.4.1 | explain the differences between RAM and ROM memory |
| 1 | 3.4 Memory | 11.3.4.2 | explain the purpose of virtual memory |
| 1 | 3.4 Memory | 11.3.4.3 | explain the purpose of cache memory |
| 1 | 5.1 Programming Paradigms | 11.5.1.1 | distinguish between generations of programming languages |
| 1 | 5.1 Programming Paradigms | 11.5.1.7 | advantages and disadvantages of compilers |
| 1 | 5.1 Programming Paradigms | 11.5.1.8 | advantages and disadvantages of interpreters |
| 1 | 6.3 Protocols | 11.6.3.3 | explain the difference between a public IP address and a private IP address and the implication for security. |
| 2 | 2.1 System life cycle | 12.2.1.1 | use a table of contents when documenting a project |
| 2 | 2.2 Engineering | 11.2.2.1 | analyse the advantages of a new system |
| 2 | 2.2 Engineering | 11.2.2.2 | analyse the restrictions of a new system |
| 2 | 2.2 Engineering | 11.2.2.3 | describe the characteristics of a development framework |
| 3 | 5.1 Programming Paradigms | 11.5.1.3 | analyze a simple program written in the language of assembly |
| 3 | 5.1 Programming Paradigms | 11.5.1.4 | use trace tables to find and verify the correctness of an algorithm |
| 3 | 5.2 Algorithms and data structure | 11.5.2.4 | write an algorithm /pseudo-code for sorting by insertion and bubble sort |
| 3 | 5.2 Algorithms and data structure | 11.5.2.5 | write a pseudo-code of binary search for the solution of a specific problem |
| 3 | 5.2 Algorithms and data structure | 11.5.2.6 | understand the time- efficiency of algorithms |
| 3 | 5.2 Algorithms and data structure | 11.5.2.7 | to understand the space- efficiency of algorithms |
| 3 | 5.4 Mobile applications development | 11.5.4.1 | create a mobile application interface using the components of an application designer |
| 3 | 5.4 Mobile applications development | 11.5.4.2 | edit properties of components in a program code |
| 3 | 5.4 Mobile applications development | 11.5.4.3 | create an application for mobile devices using conditional operators |
| 3 | 5.4 Mobile applications development | 11.5.4.4 | create an application for mobile devices using loop structures |
| 3 | 5.4 Mobile applications development | 11.5.4.5 | use the technical capabilities of smartphones when developing |
| 3 | 5.4 Mobile applications development | 11.5.4.6 | publish the results of a project on the network (application store) |

## Partially covered

| Paper | Code | Objective | Closest KTP objective |
|---|---|---|---|
| 1 | 11.1.2.2 | provide arguments for the necessity of the protection of data and computer system | 11.1.2.4 (malware problems) — no explicit 'necessity of protection' |
| 1 | 11.1.3.1 | follow the copyright law when developing applications | 12.1.3.6 (copyright rules) — not 'when developing applications' |
| 1 | 11.1.3.4 | restrict access to data made available through the Internet using a variety of methods | 12.1.2.3 (unauthorised access) — not Internet-specific methods |
| 1 | 11.3.2.1 | describe the interaction between the CPU and peripherals | 12.3.2.4 (buses) — CPU↔peripheral interaction not explicit |
| 1 | 11.3.2.2 | describe the functions of CPU, system bus and RAM | 12.3.2.4 (buses) — CPU/RAM functions not explicit |
| 1 | 12.3.4.2 | explain principle of memory organization by segment and page | 12.3.4.2 has different wording ('storing programmes and data') |
| 1 | 11.6.3.2 | explain the format of an IP address and how an IP address is associated with a device on a network | 11.6.2.1 (purpose of IP) — not the format/association with a device |
| 2 | 11.2.1.8 | develop a system requirement based on collected information | 11.2.1.5 (data collection for a new system) — not writing requirements |
| 2 | 11.3.3.1 | distinguish between laws of Boolean logic | 12.3.3.1 (laws, Grade 12) — not in Grade 11 |
| 2 | 11.3.3.3 | build truth tables AND, OR, NOT, NAND, NOR, XOR | 12.3.3.2 (logical structures) — truth tables for NAND/NOR/XOR not explicit |
| 3 | 11.5.2.1 | use the technical terms associated with arrays including upper and lower bounds | 11.5.2.1 (1D arrays) — bounds terminology not explicit |
| 3 | 11.5.2.2 | select a suitable data structure for a given task (1D or 2D array) | 11.5.2.1, 11.5.2.2 — choosing 1D vs 2D not explicit |
| 3 | 11.5.3.8 | use script language to provide interactivity | 11.5.4.6 (form processing) — interactivity not explicit |

## Full comparison

| Paper | Section | Code | Objective | Status | KTP equivalent |
|---|---|---|---|---|---|
| 1 | 1.1 | 12.1.1.1 | convert a number from one number system to another | ✅ other code | 11.1.1.2, 12.1.1.1 |
| 1 | 1.1 | 12.1.1.2 | explain the advantages of using hexadecimal numbers in computer systems | ✅ same | — |
| 1 | 1.1 | 12.1.1.3 | perform the arithmetic operations of addition and multiplication on binary numbers | ✅ same | — |
| 1 | 1.1 | 12.1.1.4 | represent a positive or negative integer in two’s complement form | ✅ other code | 12.1.1.4 |
| 1 | 1.1 | 12.1.1.5 | perform binary subtraction using two’s complement | ✅ other code | 12.1.1.5 |
| 1 | 1.1 | 12.1.1.6 | represent binary fractions using fixed-point and floating-point binary numbers | ✅ other code | 12.1.1.6, 12.1.1.7 |
| 1 | 1.1 | 12.1.1.7 | represent positive and negative decimal and floating point numbers in two’s complement form | ✅ other code | 12.1.1.7 |
| 1 | 1.2 | 11.1.2.1 | explain the difference between the terms security, privacy and data integrity | ✅ same | — |
| 1 | 1.2 | 11.1.2.2 | provide arguments for the necessity of the protection of data and computer system | ⚠️ partial | 11.1.2.4 (malware problems) — no explicit 'necessity of protection' |
| 1 | 1.2 | 11.1.2.3 | describe data protection measures such as data backup and disk mirroring | ✅ other code | 11.1.2.3 |
| 1 | 1.2 | 11.1.2.4 | describe data protection measures such as encryption and access rights to data (authorisation) | ✅ other code | 12.1.2.1, 12.1.2.3 |
| 1 | 1.2 | 11.1.2.5 | explain the difference between the terms verification and validation | ✅ other code | 11.5.4.2 |
| 1 | 1.2 | 11.1.2.6 | explain the function and operation of Blockchain technologies | ❌ missing | — |
| 1 | 1.2 | 12.1.2.1 | describe data and computer systems protection measures such as: physical risks, inter-network screens, information encryption, biometrics, computer virus countermeasures | ✅ same | — |
| 1 | 1.2 | 12.1.2.2 | use means to protect data including back up and disk mirroring | ✅ other code | 12.1.2.2 |
| 1 | 1.2 | 12.1.2.3 | protect data from unauthorised access | ✅ same | — |
| 1 | 1.3 | 11.1.3.1 | follow the copyright law when developing applications | ⚠️ partial | 12.1.3.6 (copyright rules) — not 'when developing applications' |
| 1 | 1.3 | 11.1.3.2 | describe specifics of open source software | ❌ missing | — |
| 1 | 1.3 | 11.1.3.3 | describe specifics of closed source software | ❌ missing | — |
| 1 | 1.3 | 11.1.3.4 | restrict access to data made available through the Internet using a variety of methods | ⚠️ partial | 12.1.2.3 (unauthorised access) — not Internet-specific methods |
| 1 | 1.3 | 11.1.3.5 | evaluate risks of using cloud technologies | ❌ missing | — |
| 1 | 1.3 | 12.1.3.1 | analyse ethical problems arising due to computer system cracking | ✅ same | — |
| 1 | 1.3 | 12.1.3.2 | analyse problems arising due to malware | ✅ same | — |
| 1 | 1.3 | 12.1.3.3 | explain privacy policies | ✅ same | — |
| 1 | 1.3 | 12.1.3.4 | analyse problems arising due to disseminating and using information | ✅ same | — |
| 1 | 1.3 | 12.1.3.5 | check documents using antiplagiarism resources | ✅ same | — |
| 1 | 1.3 | 12.1.3.6 | list copyright protection rules | ✅ same | — |
| 1 | 1.3 | 12.1.3.7 | use E-gov resources | ✅ same | — |
| 1 | 3.1 | 11.3.1.1 | justify their choice of applied software and choice criteria based on the goals | ✅ other code | 11.3.1.4 |
| 1 | 3.1 | 11.3.1.2 | classify application software | ✅ other code | 11.3.1.1, 11.3.1.3 |
| 1 | 3.1 | 11.3.1.3 | describe the purpose and main functions of operating systems | ✅ other code | 11.3.1.5 |
| 1 | 3.1 | 11.3.1.4 | compare single-user and multi-user operating systems | ✅ other code | 11.3.1.6 |
| 1 | 3.1 | 11.3.1.5 | compare one-task and multitasking operating systems | ✅ other code | 11.3.1.7 |
| 1 | 3.1 | 12.3.1.1 | describe features of a real-time operating system | ✅ same | — |
| 1 | 3.1 | 12.3.1.2 | describe features of a network operating system | ✅ same | — |
| 1 | 3.1 | 12.3.1.3 | describe features of a batch processing operating system | ✅ same | — |
| 1 | 3.1 | 12.3.1.4 | define the advantages and disadvantages of a graphical user interface (GUI) | ✅ same | — |
| 1 | 3.1 | 12.3.1.5 | define the advantages and disadvantages of a command line interface (CLI) | ✅ same | — |
| 1 | 3.1 | 12.3.1.6 | define the advantages and disadvantages of natural-language and gesture-recognition user interfaces | ✅ same | — |
| 1 | 3.2 | 11.3.2.1 | describe the interaction between the CPU and peripherals | ⚠️ partial | 12.3.2.4 (buses) — CPU↔peripheral interaction not explicit |
| 1 | 3.2 | 11.3.2.2 | describe the functions of CPU, system bus and RAM | ⚠️ partial | 12.3.2.4 (buses) — CPU/RAM functions not explicit |
| 1 | 3.2 | 12.3.2.1 | describe the RISC architecture | ✅ same | — |
| 1 | 3.2 | 12.3.2.2 | describe the CISC architecture | ✅ same | — |
| 1 | 3.2 | 12.3.2.3 | compare RISC and CISC | ✅ same | — |
| 1 | 3.2 | 12.3.2.4 | explain how data are transferred between the components of a computer system through the address bus, data bus and control bus | ✅ same | — |
| 1 | 3.2 | 12.3.2.5 | explain the instruction cycle (fetch / decode / execute) | ✅ other code | 12.3.2.5 |
| 1 | 3.2 | 12.3.2.6 | explain how the clock rate, word length and bus width affect the CPU performance | ✅ same | — |
| 1 | 3.4 | 11.3.4.1 | explain the differences between RAM and ROM memory | ❌ missing | — |
| 1 | 3.4 | 11.3.4.2 | explain the purpose of virtual memory | ❌ missing | — |
| 1 | 3.4 | 11.3.4.3 | explain the purpose of cache memory | ❌ missing | — |
| 1 | 3.4 | 12.3.4.1 | explain memory addressing | ✅ other code | 12.3.4.1 |
| 1 | 3.4 | 12.3.4.2 | explain principle of memory organization by segment and page | ⚠️ partial | 12.3.4.2 has different wording ('storing programmes and data') |
| 1 | 3.4 | 12.3.4.3 | explain the virtual machine concept | ✅ other code | 12.3.4.3 |
| 1 | 4.3 | 12.4.3.1 | describe spheres where artificial intelligence is applied: industry, education, medicine, gaming industry, society | ✅ same | — |
| 1 | 4.3 | 12.4.3.2 | explain the purpose of virtual and alternate reality | ✅ same | — |
| 1 | 5.1 | 11.5.1.1 | distinguish between generations of programming languages | ❌ missing | — |
| 1 | 5.1 | 11.5.1.2 | classify programming languages into low and high-level | ✅ other code | 11.5.1.1 |
| 1 | 5.1 | 11.5.1.5 | advantages and disadvantages of high-level languages | ✅ other code | 11.5.1.2 |
| 1 | 5.1 | 11.5.1.6 | advantages and disadvantages of low-level languages | ✅ other code | 11.5.1.2 |
| 1 | 5.1 | 11.5.1.7 | advantages and disadvantages of compilers | ❌ missing | — |
| 1 | 5.1 | 11.5.1.8 | advantages and disadvantages of interpreters | ❌ missing | — |
| 1 | 5.1 | 12.5.1.1 | compare declarative and imperative programming languages | ✅ same | — |
| 1 | 5.1 | 12.5.1.3 | describe program compilation stages: lexical and syntactic analysis, code generation and optimization | ✅ same | — |
| 1 | 5.1 | 12.5.1.4 | demonstrate understanding of the program compilation stages: lexical, syntactic analysis | ✅ same | — |
| 1 | 5.1 | 12.5.1.5 | demonstrate understanding of the program compilation stage: code generation | ✅ same | — |
| 1 | 5.1 | 12.5.1.6 | demonstrate understanding of code optimization as the program compilation stage | ✅ same | — |
| 1 | 6.1 | 11.6.1.1 | compare features of local (LAN) and wide area networks (WAN) | ✅ same | — |
| 1 | 6.1 | 11.6.1.2 | describe the advantages and disadvantages of network topologies bus, ring, star, mixed | ✅ other code | 11.6.1.5 |
| 1 | 6.1 | 11.6.1.3 | explain the purpose of network equipment | ✅ other code | 11.6.1.6 |
| 1 | 6.1 | 12.6.1.1 | explain the difference between packet switching and circuit switching | ✅ same | — |
| 1 | 6.1 | 12.6.1.2 | describe the functions of the OSI network model layers | ✅ same | — |
| 1 | 6.2 | 11.6.2.1 | describe the role of universal resource locator (URL) | ✅ other code | 11.6.2.5 |
| 1 | 6.2 | 11.6.2.2 | describe the purpose and organization of a domain name system (DNS) | ✅ other code | 11.6.2.4 |
| 1 | 6.2 | 11.6.2.3 | know the features of the client-server model | ✅ other code | 11.6.1.3 |
| 1 | 6.2 | 12.6.2.1 | distinguish features of the World Wide Web, Intranet and the Internet | ✅ same | — |
| 1 | 6.2 | 12.6.2.2 | describe the role of MAC addresses in packet routing | ✅ same | — |
| 1 | 6.2 | 12.6.2.3 | identify the MAC address of a computer | ✅ same | — |
| 1 | 6.3 | 11.6.3.1 | explain the role of protocols in the network (HTTP, FTP, POP3, SMTP, HTTPS, FTPS) | ✅ other code | 11.6.2.3 |
| 1 | 6.3 | 11.6.3.2 | explain the format of an IP address and how an IP address is associated with a device on a network | ⚠️ partial | 11.6.2.1 (purpose of IP) — not the format/association with a device |
| 1 | 6.3 | 11.6.3.3 | explain the difference between a public IP address and a private IP address and the implication for security. | ❌ missing | — |
| 2 | 2.1 | 11.2.1.1 | explain the life cycle stages used in the solving of problems | ✅ other code | 11.2.1.1 |
| 2 | 2.1 | 11.2.1.2 | analyse the advantages and disadvantages of agile, waterfall and spiral models | ✅ other code | 11.2.1.2 |
| 2 | 2.1 | 11.2.1.3 | describe data collection methods | ✅ same | — |
| 2 | 2.1 | 11.2.1.4 | compare different data analysis techniques | ✅ other code | 11.2.1.4 |
| 2 | 2.1 | 11.2.1.5 | compare alternative solutions to a problem in order to choose the most effective algorithm | ✅ other code | 11.2.1.6 |
| 2 | 2.1 | 11.2.1.6 | use data flow diagrams (DFD) to input, process, store and output data in computing systems | ✅ other code | 11.2.2.1 |
| 2 | 2.1 | 11.2.1.7 | use flow charts to input, process, store and output data in computing systems | ✅ other code | 11.2.2.3 |
| 2 | 2.1 | 11.2.1.8 | develop a system requirement based on collected information | ⚠️ partial | 11.2.1.5 (data collection for a new system) — not writing requirements |
| 2 | 2.1 | 12.2.1.1 | use a table of contents when documenting a project | ❌ missing | — |
| 2 | 2.1 | 12.2.1.2 | use headers and footers when documenting a project | ✅ same | — |
| 2 | 2.1 | 12.2.1.3 | use tables when documenting a project | ✅ same | — |
| 2 | 2.1 | 12.2.1.4 | set page parameters when documenting a project | ✅ same | — |
| 2 | 2.1 | 12.2.1.5 | set page numbers when documenting a project | ✅ same | — |
| 2 | 2.1 | 12.2.1.6 | set indents and line spacing when documenting a project | ✅ same | — |
| 2 | 2.1 | 12.2.1.7 | list system implementation methods | ✅ same | — |
| 2 | 2.1 | 12.2.1.8 | compare the advantages and disadvantages of system implementation methods | ✅ same | — |
| 2 | 2.1 | 12.2.1.9 | explain the importance of making a system implementation plan | ✅ same | — |
| 2 | 2.1 | 12.2.1.10 | make a system implementation plan | ✅ same | — |
| 2 | 2.2 | 11.2.2.1 | analyse the advantages of a new system | ❌ missing | — |
| 2 | 2.2 | 11.2.2.2 | analyse the restrictions of a new system | ❌ missing | — |
| 2 | 2.2 | 11.2.2.3 | describe the characteristics of a development framework | ❌ missing | — |
| 2 | 2.2 | 11.2.2.4 | discuss the advantages and disadvantages of using prototypes when developing solutions | ✅ same | — |
| 2 | 2.2 | 11.2.2.5 | discuss the use of prototypes based on a specific example | ✅ other code | 11.2.2.4 |
| 2 | 2.2 | 11.2.2.6 | develop a prototype for a new system | ✅ other code | 11.2.2.5 |
| 2 | 2.2 | 11.2.2.7 | define minimum requirements for hardware when implementing solutions | ✅ other code | 11.3.2.1 |
| 2 | 3.3 | 11.3.3.1 | distinguish between laws of Boolean logic | ⚠️ partial | 12.3.3.1 (laws, Grade 12) — not in Grade 11 |
| 2 | 3.3 | 11.3.3.2 | simplify logical expressions using the laws of Boolean logic | ✅ other code | 12.3.3.3 |
| 2 | 3.3 | 11.3.3.3 | build truth tables AND, OR, NOT, NAND, NOR, XOR | ⚠️ partial | 12.3.3.2 (logical structures) — truth tables for NAND/NOR/XOR not explicit |
| 2 | 3.3 | 12.3.3.1 | reduce formulas to normal logic using the laws of formal logic and rules of logical transformation | ✅ same | — |
| 2 | 3.3 | 12.3.3.2 | simplify logical expressions using the laws of logic | ✅ other code | 12.3.3.3 |
| 2 | 3.3 | 12.3.3.3 | build logical structures | ✅ other code | 12.3.3.2 |
| 2 | 3.3 | 12.3.3.4 | build logical expressions according to logical structures | ✅ other code | 12.3.3.2 |
| 2 | 4.1 | 11.4.1.1 | describe relational databases and their purpose | ✅ same | — |
| 2 | 4.1 | 11.4.1.2 | use the terms attribute, object, index, record, table and tuple to describe databases | ✅ other code | 11.4.1.2 |
| 2 | 4.1 | 11.4.1.3 | explain the difference between primary composite and foreign key | ✅ same | — |
| 2 | 4.1 | 11.4.1.4 | define data types when creating a database | ✅ same | — |
| 2 | 4.1 | 11.4.1.5 | define the connections between tables in database(1-3NF) | ✅ other code | 11.4.1.9, 11.4.1.10 |
| 2 | 4.1 | 11.4.1.6 | define the connections between tables | ✅ other code | 11.4.1.8 |
| 2 | 4.1 | 11.4.1.7 | create an entity-relationship (ER) model | ✅ other code | 11.2.2.2 |
| 2 | 4.2 | 11.4.2.3 | describe the basic SQL queries for working with tables in a database: CREATE, ALTER, and DROP | ✅ other code | 11.4.2.2 |
| 2 | 4.2 | 11.4.2.4 | use the basic SQL queries for working with one table in a database: SELECT, UPDATE, INSERT and DELETE | ✅ other code | 11.4.2.3 |
| 2 | 4.2 | 11.4.2.5 | use SQL SELECT for data selection in more tables | ✅ other code | 11.4.2.4 |
| 2 | 4.2 | 11.4.2.1 | explain the purpose of data dictionary | ✅ other code | 11.4.1.5 |
| 3 | 5.1 | 11.5.1.3 | analyze a simple program written in the language of assembly | ❌ missing | — |
| 3 | 5.1 | 11.5.1.4 | use trace tables to find and verify the correctness of an algorithm | ❌ missing | — |
| 3 | 5.1 | 12.5.1.2 | create a simple expert system | ✅ same | — |
| 3 | 5.2 | 11.5.2.1 | use the technical terms associated with arrays including upper and lower bounds | ⚠️ partial | 11.5.2.1 (1D arrays) — bounds terminology not explicit |
| 3 | 5.2 | 11.5.2.2 | select a suitable data structure for a given task (1D or 2D array) | ⚠️ partial | 11.5.2.1, 11.5.2.2 — choosing 1D vs 2D not explicit |
| 3 | 5.2 | 11.5.2.3 | write program code using 1D and 2D arrays | ✅ other code | 11.5.2.1, 11.5.2.2 |
| 3 | 5.2 | 11.5.2.4 | write an algorithm /pseudo-code for sorting by insertion and bubble sort | ❌ missing | — |
| 3 | 5.2 | 11.5.2.5 | write a pseudo-code of binary search for the solution of a specific problem | ❌ missing | — |
| 3 | 5.2 | 11.5.2.6 | understand the time- efficiency of algorithms | ❌ missing | — |
| 3 | 5.2 | 11.5.2.7 | to understand the space- efficiency of algorithms | ❌ missing | — |
| 3 | 5.2 | 12.5.2.1 | describe the operation of stack and queue data structures | ✅ same | — |
| 3 | 5.2 | 12.5.2.2 | build a binary tree | ✅ same | — |
| 3 | 5.3 | 11.5.3.1 | create a site using basic HTML tags | ✅ other code | 11.5.3.1, 11.5.3.2 |
| 3 | 5.3 | 11.5.3.2 | create forms for data entry using HTML tags | ✅ other code | 11.5.3.4 |
| 3 | 5.3 | 11.5.3.3 | use the CSS stylesheet when creating a site | ✅ other code | 11.5.3.6 |
| 3 | 5.3 | 11.5.3.4 | use script language to connect a database | ✅ other code | 11.5.4.5 |
| 3 | 5.3 | 11.5.3.5 | use script language to work with databases | ✅ other code | 11.5.4.7, 11.5.4.8 |
| 3 | 5.3 | 11.5.3.6 | use various algorithmic structures in script language | ✅ other code | 11.5.4.1, 11.5.4.4 |
| 3 | 5.3 | 11.5.3.7 | use script language in site design | ✅ other code | 11.5.4.6 |
| 3 | 5.3 | 11.5.3.8 | use script language to provide interactivity | ⚠️ partial | 11.5.4.6 (form processing) — interactivity not explicit |
| 3 | 5.3 | 11.5.3.9 | write a program code using a basic algorithmic "sequential" structure when developing a project | ✅ other code | 11.5.4.1, 11.5.4.4 |
| 3 | 5.3 | 11.5.3.10 | write a program code using a basic algorithmic "branching" structure when developing a project | ✅ other code | 11.5.4.1 |
| 3 | 5.3 | 11.5.3.11 | write a program code using a basic algorithmic "loop" structure when developing a project | ✅ other code | 11.5.4.4 |
| 3 | 5.3 | 11.5.3.12 | follow the rules of good programming style when writing a program code | ✅ other code | 11.5.4.9 |
| 3 | 5.3 | 12.5.3.1 | describe execution errors when a program is started | ✅ same | — |
| 3 | 5.3 | 12.5.3.2 | perform testing using normal data | ✅ same | — |
| 3 | 5.3 | 12.5.3.3 | perform testing using extreme data | ✅ same | — |
| 3 | 5.3 | 12.5.3.4 | perform testing using erroneous data | ✅ same | — |
| 3 | 5.3 | 12.5.3.5 | describe a syntax error in a program code | ✅ same | — |
| 3 | 5.3 | 12.5.3.6 | describe a logical error in a program code | ✅ same | — |
| 3 | 5.4 | 11.5.4.1 | create a mobile application interface using the components of an application designer | ❌ missing | — |
| 3 | 5.4 | 11.5.4.2 | edit properties of components in a program code | ❌ missing | — |
| 3 | 5.4 | 11.5.4.3 | create an application for mobile devices using conditional operators | ❌ missing | — |
| 3 | 5.4 | 11.5.4.4 | create an application for mobile devices using loop structures | ❌ missing | — |
| 3 | 5.4 | 11.5.4.5 | use the technical capabilities of smartphones when developing | ❌ missing | — |
| 3 | 5.4 | 11.5.4.6 | publish the results of a project on the network (application store) | ❌ missing | — |
