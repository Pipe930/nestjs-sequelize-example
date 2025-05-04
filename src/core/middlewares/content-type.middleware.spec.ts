import { UnsupportedMediaTypeException } from '@nestjs/common';
import { ContentTypeMiddleware } from './content-type.middleware';

describe('ContentTypeMiddleware', () => {

  let middleware: ContentTypeMiddleware;
  let mockReq: any;
  let mockRes: any;
  let mockNext = jest.fn();

  beforeEach(() => {
    middleware = new ContentTypeMiddleware();
    mockRes = {};
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next() if Content-Type is application/json', () => {
    mockReq = {
      headers: {
        'content-type': 'application/json',
      },
    };

    middleware.use(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw an exception if Content-Type is not present', () => {
    mockReq = {
      headers: {},
    };

    expect(() => middleware.use(mockReq, mockRes, mockNext)).toThrow(UnsupportedMediaTypeException);
  });

  it('should throw an exception if Content-Type is not application/json', () => {
    mockReq = {
      headers: {
        'content-type': 'text/plain',
      },
    };

    expect(() => middleware.use(mockReq, mockRes, mockNext)).toThrow(UnsupportedMediaTypeException);
  });
});
