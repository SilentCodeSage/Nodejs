def process_list(numbers):
    reversed_numbers = numbers[::-1]
    result = []

    for i in range(len(numbers)):
        if i % 2 == 1:
            sum_value = numbers[i] + reversed_numbers[i]
            result.append(sum_value)
        else:
            result.append(numbers[i]) 
    
    return result

input_str = input()
number_list = list(map(int, input_str.split()))

new_list = process_list(number_list)
print(" ".join(map(str, new_list)))
