import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StringTrimPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {

        if (typeof value === 'string') return value.trim();
        if (typeof value === 'object' && value !== null) return this.trimObject(value);

        return value;
    }

    private trimObject(obj: Record<string, any>) {
        const trimmed: Record<string, any> = {};

        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                trimmed[key] = obj[key].trim();
            } else {
                trimmed[key] = obj[key];
            }
        }

        return trimmed;
    }
}
