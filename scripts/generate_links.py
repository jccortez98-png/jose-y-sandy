#!/usr/bin/env python3
"""
Wedding Guest Link Generator - José & Sandy
Genera URLs personalizadas y mensajes listos para WhatsApp a partir de un archivo CSV de invitados.

Uso:
    python3 scripts/generate_links.py [archivo_csv] [url_base]
Ejemplo:
    python3 scripts/generate_links.py data/guests-example.csv https://boda-joseysandy.com
"""

import csv
import sys
import urllib.parse

DEFAULT_BASE_URL = "https://boda-joseysandy.com"
DEFAULT_CSV = "data/guests-example.csv"

def generate_guest_links(csv_path=DEFAULT_CSV, base_url=DEFAULT_BASE_URL):
    print(f"==================================================")
    print(f"💍 Generador de Enlaces de Invitación (José & Sandy)")
    print(f"📂 Leyendo archivo: {csv_path}")
    print(f"🌐 URL Base: {base_url}")
    print(f"==================================================\n")

    try:
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            total_guests = 0
            total_passes = 0

            output_rows = []

            for row in reader:
                name = row.get('Nombre', '').strip()
                if not name:
                    continue
                
                passes = row.get('Pases', '2').strip()
                phone = row.get('Telefono', '').strip().replace(' ', '').replace('-', '')
                table = row.get('Mesa', '').strip()

                total_guests += 1
                try:
                    total_passes += int(passes)
                except ValueError:
                    pass

                # Build Query Params
                params = {
                    'invitado': name,
                    'pases': passes
                }
                if table:
                    params['mesa'] = table

                query_string = urllib.parse.urlencode(params, quote_via=urllib.parse.quote)
                invitation_url = f"{base_url}/?{query_string}"

                # WhatsApp invitation message for the guest
                wa_message = (
                    f"¡Hola {name}! 💌 Nos llena de felicidad invitarte a nuestra boda.\n\n"
                    f"Hemos preparado esta invitación digital especialmente para ti:\n"
                    f"{invitation_url}\n\n"
                    f"💍 Pases asignados: {passes}\n"
                    f"Esperamos contar con tu presencia para celebrar juntos este día tan especial."
                )
                wa_encoded = urllib.parse.quote(wa_message)
                wa_send_url = f"https://wa.me/{phone.replace('+', '')}?text={wa_encoded}" if phone else ""

                output_rows.append({
                    'name': name,
                    'passes': passes,
                    'phone': phone,
                    'table': table,
                    'invitation_url': invitation_url,
                    'wa_send_url': wa_send_url,
                    'message': wa_message
                })

                print(f"[{total_guests}] {name} ({passes} pases)")
                print(f"    🔗 Enlace: {invitation_url}")
                if wa_send_url:
                    print(f"    📲 Enviar WA: {wa_send_url}")
                print("-" * 50)

            # Export to output CSV
            output_csv_path = csv_path.replace('.csv', '_generados.csv')
            with open(output_csv_path, mode='w', encoding='utf-8', newline='') as out_f:
                fieldnames = ['Nombre', 'Pases', 'Telefono', 'Mesa', 'Enlace_Invitacion', 'Enlace_WhatsApp', 'Mensaje']
                writer = csv.DictWriter(out_f, fieldnames=fieldnames)
                writer.writeheader()
                for r in output_rows:
                    writer.writerow({
                        'Nombre': r['name'],
                        'Pases': r['passes'],
                        'Telefono': r['phone'],
                        'Mesa': r['table'],
                        'Enlace_Invitacion': r['invitation_url'],
                        'Enlace_WhatsApp': r['wa_send_url'],
                        'Mensaje': r['message']
                    })

            print(f"\n✨ ¡Completado exitosamente!")
            print(f"👥 Total de Invitaciones: {total_guests}")
            print(f"🎟️ Total de Pases Asignados: {total_passes}")
            print(f"💾 Archivo generado con todos los enlaces: {output_csv_path}\n")

    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{csv_path}'")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    csv_file = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CSV
    url_base = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_BASE_URL
    generate_guest_links(csv_file, url_base)
