---
title: Concepts
sidebar_position: 10
---

## What is Pantavisor Linux?

**Pantavisor Linux** is a framework for building embedded Linux systems that uses **LXC (Linux Containers)** to transform software and firmware into manageable, portable building blocks. This approach simplifies the development of IoT products, as it lets developers focus on features and services instead of the underlying operating system.

---

### Key Concepts

* **LXC (Linux Containers):** A lightweight virtualization technology that isolates processes and system resources without the overhead of a full virtual machine. Pantavisor uses LXC to package system components like the **firmware**, the **operating system (OS)**, and the **Board Support Package (BSP)** into modular units.
* **Software-Defined:** Pantavisor makes software, including firmware, "software-defined." This means these components can be managed, updated, and moved flexibly, just like other applications, by using containers.
* **Building Blocks:** The framework modularizes the system into containerized units, allowing developers to **mix and match** different versions of BSPs, OSes, and apps. This simplifies customization and maintenance, making "over-the-air" (OTA) updates safer and transactional.
* **Docker Conversion:** Pantavisor can convert **Docker** containers to the LXC format, optimizing them for devices with limited resources—a key benefit for embedded systems.

---

### Benefits of Pantavisor

In short, Pantavisor simplifies the IoT development lifecycle by providing a flexible and robust way to manage embedded software, treating every component as a modular container. This reduces dependency on specific Linux distributions and hardware, which speeds up product development.
